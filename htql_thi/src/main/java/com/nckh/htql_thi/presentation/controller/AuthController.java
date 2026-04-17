package com.nckh.htql_thi.presentation.controller;

import com.nckh.htql_thi.application.dto.AuthResponse;
import com.nckh.htql_thi.application.port.in.ManageAuthUseCase;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final ManageAuthUseCase authUseCase;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authUseCase.login(request.getUsername(), request.getPassword()));
    }

    @Data
    public static class LoginRequest {
        private String username;
        private String password;
    }
}