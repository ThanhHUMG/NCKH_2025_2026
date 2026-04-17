package com.nckh.htql_thi.application.service;

import com.nckh.htql_thi.application.port.in.ManageUserUseCase;
import com.nckh.htql_thi.application.port.out.GiaoVienPort;
import com.nckh.htql_thi.application.port.out.SinhVienPort;
import com.nckh.htql_thi.application.port.out.UserPort;
import com.nckh.htql_thi.domain.entity.GiaoVien;
import com.nckh.htql_thi.domain.entity.SinhVien;
import com.nckh.htql_thi.domain.entity.User;
import com.nckh.htql_thi.domain.enums.Role;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService implements ManageUserUseCase {

    private final UserPort userPort;
    private final SinhVienPort sinhVienPort;
    private final GiaoVienPort giaoVienPort;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserPort userPort,
                       SinhVienPort sinhVienPort,
                       GiaoVienPort giaoVienPort,
                       PasswordEncoder passwordEncoder) {
        this.userPort = userPort;
        this.sinhVienPort = sinhVienPort;
        this.giaoVienPort = giaoVienPort;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public List<User> getAllUsers() {
        return userPort.findAll();
    }

    @Override
    public User getUserById(Long id) {
        return userPort.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user ID: " + id));
    }

    @Override
    public User getUserByUsername(String username) {
        return userPort.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user username: " + username));
    }

    @Override
    public User createAdmin(String username, String password) {

        validateUsernamePassword(username, password);

        if (userPort.existsByUsername(username.trim())) {
            throw new RuntimeException("Username đã tồn tại");
        }

        User user = User.builder()
                .username(username.trim())
                .password(passwordEncoder.encode(password))
                .role(Role.ADMIN)
                .build();

        return userPort.save(user);
    }

    @Override
    public User createStudentAccount(String username, String password, Long msv) {

        validateUsernamePassword(username, password);

        if (msv == null) {
            throw new RuntimeException("MSV không được để trống");
        }

        if (userPort.existsByUsername(username.trim())) {
            throw new RuntimeException("Username đã tồn tại");
        }

        SinhVien sinhVien = sinhVienPort.timTheoId(msv)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sinh viên MSV: " + msv));

        User user = User.builder()
                .username(username.trim())
                .password(passwordEncoder.encode(password))
                .role(Role.STUDENT)
                .sinhVien(sinhVien)
                .build();

        return userPort.save(user);
    }

    @Override
    public User createTeacherAccount(String username, String password, Long maGiaoVien) {

        validateUsernamePassword(username, password);

        if (maGiaoVien == null) {
            throw new RuntimeException("Mã giáo viên không được để trống");
        }

        if (userPort.existsByUsername(username.trim())) {
            throw new RuntimeException("Username đã tồn tại");
        }

        GiaoVien giaoVien = giaoVienPort.timTheoId(maGiaoVien)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy giáo viên ID: " + maGiaoVien));

        User user = User.builder()
                .username(username.trim())
                .password(passwordEncoder.encode(password))
                .role(Role.TEACHER)
                .giaoVien(giaoVien)
                .build();

        return userPort.save(user);
    }

    @Override
    public void deleteUser(Long id) {
        userPort.deleteById(id);
    }

    private void validateUsernamePassword(String username, String password) {

        if (username == null || username.trim().isEmpty()) {
            throw new RuntimeException("Username không được để trống");
        }

        if (password == null || password.trim().isEmpty()) {
            throw new RuntimeException("Password không được để trống");
        }

        if (password.length() < 4) {
            throw new RuntimeException("Password phải >= 4 ký tự");
        }
    }
}