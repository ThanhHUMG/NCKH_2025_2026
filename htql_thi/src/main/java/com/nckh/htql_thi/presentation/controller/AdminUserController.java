package com.nckh.htql_thi.presentation.controller;

import com.nckh.htql_thi.application.port.in.ManageAdminUseCase;
import com.nckh.htql_thi.domain.entity.User;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final ManageAdminUseCase adminUseCase;

    @PostMapping("/create-student")
    public ResponseEntity<User> createStudent(@RequestBody CreateStudentRequest request) {
        return ResponseEntity.ok(
                adminUseCase.createStudentAccount(request.getUsername(), request.getPassword(), request.getMsv())
        );
    }

    @PostMapping("/create-teacher")
    public ResponseEntity<User> createTeacher(@RequestBody CreateTeacherRequest request) {
        return ResponseEntity.ok(
                adminUseCase.createTeacherAccount(request.getUsername(), request.getPassword(), request.getMaGiaoVien())
        );
    }

    @Data
    public static class CreateStudentRequest {
        private String username;
        private String password;
        private Long msv;
    }

    @Data
    public static class CreateTeacherRequest {
        private String username;
        private String password;
        private Long maGiaoVien;
    }
}