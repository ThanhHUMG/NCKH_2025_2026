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

import com.nckh.htql_thi.dto.request.student.StudentCreationRequest;
import com.nckh.htql_thi.dto.request.student.StudentUpdateRequest;
import com.nckh.htql_thi.entity.Student;
import com.nckh.htql_thi.repository.StudentRepository;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    public Student createRequest(StudentCreationRequest request) {
        Student student = new Student();
        student.setHoTen(request.getHoTen());
        student.setNganh(request.getNganh());
        student.setLop(request.getLop());
        student.setSdt(request.getSdt());
        student.setEmail(request.getEmail());
        student.setDiaChi(request.getDiaChi());

        return studentRepository.save(student);
    }

    public List<Student> getStudents() {
        return studentRepository.findAll();
    }

    public Student getStudent(Long msv) {
        return studentRepository.findById(msv)
                .orElseThrow(() -> new RuntimeException("Student not found"));
    }

    public Student updateStudent(Long studentMsv, StudentUpdateRequest request) {
        Student student = getStudent(studentMsv);

        student.setHoTen(request.getHoTen());
        student.setNganh(request.getNganh());
        student.setLop(request.getLop());
        student.setSdt(request.getSdt());
        student.setEmail(request.getEmail());
        student.setDiaChi(request.getDiaChi());

        return studentRepository.save(student);
    }

    public void deleteStudent(Long studentMsv) {
        studentRepository.deleteById(studentMsv);
    }

    public List<Student> importStudents(MultipartFile file) throws IOException {
        List<Student> students = new ArrayList<>();
        DataFormatter formatter = new DataFormatter();

        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);

            for (Row row : sheet) {
                if (row.getRowNum() == 0) continue;

                Student student = new Student();

                String msvStr = formatter.formatCellValue(row.getCell(0));
                if (!msvStr.isEmpty()) {
                    student.setMsv(Long.parseLong(msvStr));
                }

                student.setHoTen(formatter.formatCellValue(row.getCell(1)));
                student.setNganh(formatter.formatCellValue(row.getCell(2)));
                student.setLop(formatter.formatCellValue(row.getCell(3)));
                student.setSdt(formatter.formatCellValue(row.getCell(4)));
                student.setEmail(formatter.formatCellValue(row.getCell(5)));
                student.setDiaChi(formatter.formatCellValue(row.getCell(6)));

                students.add(student);
            }
        }

        return studentRepository.saveAll(students);
    }
}