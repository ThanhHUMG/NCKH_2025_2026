package com.nckh.htql_thi.presentation.controller;

import com.nckh.htql_thi.application.port.in.ManageUserUseCase;
import com.nckh.htql_thi.domain.entity.User;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/user-manage")
@RequiredArgsConstructor
public class UserController {

    private final ManageUserUseCase userUseCase;

    @GetMapping
    public ResponseEntity<List<User>> getAll() {
        return ResponseEntity.ok(userUseCase.getAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getById(@PathVariable Long id) {
        return ResponseEntity.ok(userUseCase.getUserById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        userUseCase.deleteUser(id);
        return ResponseEntity.ok("Xóa user thành công");
    }

    @PostMapping("/create-admin")
    public ResponseEntity<User> createAdmin(@RequestBody CreateAdminRequest request) {
        return ResponseEntity.ok(userUseCase.createAdmin(request.getUsername(), request.getPassword()));
    }

    @Data
    public static class CreateAdminRequest {
        private String username;
        private String password;
    }
}