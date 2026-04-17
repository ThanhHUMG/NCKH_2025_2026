package com.nckh.htql_thi.application.service;

import com.nckh.htql_thi.application.dto.AuthResponse;
import com.nckh.htql_thi.application.port.in.ManageAuthUseCase;
import com.nckh.htql_thi.application.port.out.UserPort;
import com.nckh.htql_thi.domain.entity.User;
import com.nckh.htql_thi.infrastructure.security.JwtService;
import org.springframework.security.authentication.*;
import org.springframework.stereotype.Service;

@Service
public class AuthService implements ManageAuthUseCase {

    private final AuthenticationManager authenticationManager;
    private final UserPort userPort;
    private final JwtService jwtService;

    public AuthService(AuthenticationManager authenticationManager,
                       UserPort userPort,
                       JwtService jwtService) {
        this.authenticationManager = authenticationManager;
        this.userPort = userPort;
        this.jwtService = jwtService;
    }

    @Override
    public AuthResponse login(String username, String password) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password)
        );

        User user = userPort.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user"));

        String token = jwtService.generateToken(user.getUsername(), user.getRole().name());

        return new AuthResponse(token, user.getRole().name());
    }
}