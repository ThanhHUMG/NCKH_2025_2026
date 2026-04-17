package com.nckh.htql_thi.application.port.in;

import com.nckh.htql_thi.application.dto.AuthResponse;

public interface ManageAuthUseCase {

    AuthResponse login(String username, String password);
}