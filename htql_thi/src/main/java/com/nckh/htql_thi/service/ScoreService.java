package com.nckh.htql_thi.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.nckh.htql_thi.dto.request.score.ScoreCreationRequest;
import com.nckh.htql_thi.entity.Exam;
import com.nckh.htql_thi.entity.Score;
import com.nckh.htql_thi.entity.Student;
import com.nckh.htql_thi.repository.ScoreRepository;

@Service
public class ScoreService {
    @Autowired
    private ExamService examService;
    @Autowired
    private StudentService studentService;
    @Autowired
    private ScoreRepository scoreRepository;

    private String quyDoiDiemChu(Double tb) {
    if (tb == null) return "F";
    if (tb >= 9.0) return "A+";
    if (tb >= 8.5) return "A";
    if (tb >= 8.0) return "B+";
    if (tb >= 7.0) return "B";
    if (tb >= 6.5) return "C+";
    if (tb >= 5.5) return "C";
    if (tb >= 5.0) return "D+";
    if (tb >= 4.0) return "D";
    return "F";
}
    public Score createScore(ScoreCreationRequest request) {
        Exam exam = examService.getExam(request.getExamId());
        Student student = studentService.getStudent(request.getStudentMsv());

        Score score = new Score();
        score.setExam(exam);
        score.setStudent(student);
        score.setDiemA(request.getDiemA());
        score.setDiemB(request.getDiemB());
        score.setDiemC(request.getDiemC());

        double tb = (request.getDiemA() * 0.6) + (request.getDiemB() * 0.3) + (request.getDiemC() * 0.1);
        score.setDiemTB(Math.round(tb * 10.0) / 10.0);
        score.setDiemChu(quyDoiDiemChu(score.getDiemTB()));

        return scoreRepository.save(score);
    }
    public List<Score> getScores() {
        return scoreRepository.findAll();
    }

    public Score getScore(Long scoreId) {
        return scoreRepository.findById(scoreId)
                .orElseThrow(() -> new RuntimeException("Score not found"));
    }

    public Score updateScore(Long scoreId, ScoreCreationRequest request) {
        Score score = getScore(scoreId);

        Exam exam = examService.getExam(request.getExamId());
        Student student = studentService.getStudent(request.getStudentMsv());

        score.setExam(exam);
        score.setStudent(student);
        score.setDiemA(request.getDiemA());
        score.setDiemB(request.getDiemB());
        score.setDiemC(request.getDiemC());

        double tb = (request.getDiemA() * 0.6) + (request.getDiemB() * 0.3) + (request.getDiemC() * 0.1);
        score.setDiemTB(Math.round(tb * 10.0) / 10.0);
        score.setDiemChu(quyDoiDiemChu(score.getDiemTB()));
        return scoreRepository.save(score);
    }

    public void deleteScore(Long scoreId) {
        scoreRepository.deleteById(scoreId);
    }
    public List<Score> importScores(MultipartFile file) throws IOException {
        List<Score> scores = new ArrayList<>();
        DataFormatter formatter = new DataFormatter();

        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);

            for (Row row : sheet) {
                if (row.getRowNum() == 0) continue;

                try {
                    Score score = new Score();

                    String msvStr = formatter.formatCellValue(row.getCell(0));
                    if (msvStr.isEmpty()) continue; // Bỏ qua dòng trống
                    score.setStudent(studentService.getStudent(Long.parseLong(msvStr)));

                    String examIdStr = formatter.formatCellValue(row.getCell(1));
                    if (examIdStr.isEmpty()) continue;
                    score.setExam(examService.getExam(Long.parseLong(examIdStr)));

                    String da = formatter.formatCellValue(row.getCell(2));
                    String db = formatter.formatCellValue(row.getCell(3));
                    String dc = formatter.formatCellValue(row.getCell(4));

                    score.setDiemA(da.isEmpty() ? 0.0 : Double.parseDouble(da));
                    score.setDiemB(db.isEmpty() ? 0.0 : Double.parseDouble(db));
                    score.setDiemC(dc.isEmpty() ? 0.0 : Double.parseDouble(dc));

                    double tb = (score.getDiemA() * 0.6) + (score.getDiemB() * 0.3) + (score.getDiemC() * 0.1);
                    score.setDiemTB(Math.round(tb * 10.0) / 10.0);
                    score.setDiemChu(quyDoiDiemChu(score.getDiemTB()));

                    scores.add(score);
                } catch (Exception e) {
                    System.err.println("Lỗi tại dòng " + row.getRowNum() + ": " + e.getMessage());
                    continue;
                }
            }
        }

        return scoreRepository.saveAll(scores);
    }
}