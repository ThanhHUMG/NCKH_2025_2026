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

import com.nckh.htql_thi.dto.request.exam.ExamCreationRequest;
import com.nckh.htql_thi.entity.Exam;
import com.nckh.htql_thi.service.ExamService;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.multipart.MultipartFile;




@RestController
@RequestMapping("/exam")
public class ExamController {
    @Autowired
    private ExamService examService;
    @PostMapping
    public Exam createExam(@RequestBody ExamCreationRequest request) {
        return examService.createRequest(request);
    }
    @GetMapping
    public List<Exam> getExams() {
        return examService.getExams();
    }

    @GetMapping("/{examid}")
    public Exam getExam(@PathVariable("examid") Long examid) {
        return examService.getExam(examid);
    }
    @PutMapping("/{examid}")
    public Exam updateExam(@PathVariable("examid") Long examid, @RequestBody ExamCreationRequest request) {
        return examService.updateExam(examid, request);
    }
    @DeleteMapping("/{examid}")
    public String deleteExam(@PathVariable("examid") Long examid) {
        examService.deleteExam(examid);
        return "Mon thi co ID : " + examid + " da duoc xoa";
    }
    @PutMapping("/import")
    public String importExcel(@RequestParam("file") MultipartFile file) {
        try {
            examService.importExams(file);
            return "Import dữ liệu thành công!";
        } catch (Exception e) {
            return "Lỗi khi import dữ liệu: " + e.getMessage();
        }
    }
}
