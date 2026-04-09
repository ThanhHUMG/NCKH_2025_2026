package com.nckh.htql_thi.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.nckh.htql_thi.dto.request.student.StudentCreationRequest;
import com.nckh.htql_thi.dto.request.student.StudentUpdateRequest;
import com.nckh.htql_thi.entity.Student;
import com.nckh.htql_thi.service.StudentService;
import org.springframework.web.bind.annotation.PutMapping;




@RestController
@RequestMapping("/student")
public class StudentController {

    @Autowired
    private StudentService studentService;

    @PostMapping
    public Student createStudent(@RequestBody StudentCreationRequest request) {
        return studentService.createRequest(request);
    }
    @GetMapping
    public List<Student> getStudents() {
        return studentService.getStudents();
    }

    @GetMapping("/{studentMsv}")
    public Student getStudent(@PathVariable("studentMsv") Long studentMsv) {
        return studentService.getStudent(studentMsv);
    }
    @PutMapping("/{studentMsv}")
    public Student updateStudent(@PathVariable Long studentMsv, @RequestBody StudentUpdateRequest request) {
        return studentService.updateStudent(studentMsv, request);
    }

    @DeleteMapping("/{studentMsv}")
    public String deleteStudent(@PathVariable Long studentMsv) {
        studentService.deleteStudent(studentMsv);
        return "Sinh vien co MSV : " + studentMsv + " da duoc xoa";
    }
    @PostMapping("/import")
    public String importExcel(@RequestParam("file") MultipartFile file) {
    try {
        studentService.importStudents(file);
        return "Import dữ liệu thành công!";
    } catch (Exception e) {
        return "Lỗi khi import: " + e.getMessage();
    }
}
}