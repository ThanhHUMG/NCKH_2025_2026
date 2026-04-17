package com.nckh.htql_thi.presentation.controller;

import com.nckh.htql_thi.application.port.in.ManageStudentUseCase;
import com.nckh.htql_thi.domain.entity.DiemThi;
import com.nckh.htql_thi.domain.entity.SinhVien;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student")
@RequiredArgsConstructor
public class StudentController {

    private final ManageStudentUseCase studentUseCase;

    @GetMapping("/me")
    public ResponseEntity<SinhVien> getMyInfo(Authentication authentication) {
        return ResponseEntity.ok(studentUseCase.getMyInfo(authentication.getName()));
    }

    @GetMapping("/diem")
    public ResponseEntity<List<DiemThi>> getMyScores(Authentication authentication) {
        return ResponseEntity.ok(studentUseCase.getMyScores(authentication.getName()));
    }
}