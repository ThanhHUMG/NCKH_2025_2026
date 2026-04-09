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

import com.nckh.htql_thi.dto.request.exam.ExamCreationRequest;
import com.nckh.htql_thi.entity.Exam;
import com.nckh.htql_thi.repository.ExamRepository;

@Service
public class ExamService {
    @Autowired
    private ExamRepository examRepository;
    public Exam createRequest(ExamCreationRequest request) {
        Exam exam = new Exam();
        exam.setTenMonThi(request.getTenMonThi());
        exam.setMaMonThi(request.getMaMonThi());
        exam.setNgayThi(request.getNgayThi());
        exam.setGioThi(request.getGioThi());
        exam.setPhongThi(request.getPhongThi());
        exam.setKiThi(request.getKiThi());
        exam.setHinhThucThi(request.getHinhThucThi());

        return examRepository.save(exam);
    }

    public List<Exam> getExams() {
        return examRepository.findAll();
    }

    public Exam getExam(Long examId) {
        return examRepository.findById(examId)
                .orElseThrow(() -> new RuntimeException("Exam not found"));
    }

    public Exam updateExam(Long examId, ExamCreationRequest request) {
        Exam exam = getExam(examId);

        exam.setTenMonThi(request.getTenMonThi());
        exam.setMaMonThi(request.getMaMonThi());
        exam.setNgayThi(request.getNgayThi());
        exam.setGioThi(request.getGioThi());
        exam.setPhongThi(request.getPhongThi());
        exam.setKiThi(request.getKiThi());
        exam.setHinhThucThi(request.getHinhThucThi());

        return examRepository.save(exam);
    }

    public void deleteExam(Long examId) {
        examRepository.deleteById(examId);
    }
    public List<Exam> importExams(MultipartFile file) throws IOException {
        List<Exam> exams = new ArrayList<>();
        DataFormatter formatter = new DataFormatter();

        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);

            for (Row row : sheet) {
                if (row.getRowNum() == 0) continue;

                Exam exam = new Exam();

                String msvStr = formatter.formatCellValue(row.getCell(0));
                if (!msvStr.isEmpty()) {
                    exam.setMaMonThi(msvStr);
                }

                exam.setTenMonThi(formatter.formatCellValue(row.getCell(1)));
                exam.setNgayThi(formatter.formatCellValue(row.getCell(2)));
                exam.setGioThi(formatter.formatCellValue(row.getCell(3)));
                exam.setPhongThi(formatter.formatCellValue(row.getCell(4)));
                exam.setKiThi(formatter.formatCellValue(row.getCell(5)));
                exam.setHinhThucThi(formatter.formatCellValue(row.getCell(6)));

                exams.add(exam);
            }
        }

        return examRepository.saveAll(exams);
    }
}
