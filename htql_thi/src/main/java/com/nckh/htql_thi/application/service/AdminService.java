package com.nckh.htql_thi.application.service;

import com.nckh.htql_thi.application.port.in.ManageAdminUseCase;
import com.nckh.htql_thi.application.port.out.GiaoVienPort;
import com.nckh.htql_thi.application.port.out.SinhVienPort;
import com.nckh.htql_thi.application.port.out.UserPort;
import com.nckh.htql_thi.domain.entity.GiaoVien;
import com.nckh.htql_thi.domain.entity.SinhVien;
import com.nckh.htql_thi.domain.entity.User;
import com.nckh.htql_thi.domain.enums.Role;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AdminService implements ManageAdminUseCase {

    private final UserPort userPort;
    private final SinhVienPort sinhVienPort;
    private final GiaoVienPort giaoVienPort;
    private final PasswordEncoder passwordEncoder;

    public AdminService(UserPort userPort,
                        SinhVienPort sinhVienPort,
                        GiaoVienPort giaoVienPort,
                        PasswordEncoder passwordEncoder) {
        this.userPort = userPort;
        this.sinhVienPort = sinhVienPort;
        this.giaoVienPort = giaoVienPort;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public User createStudentAccount(String username, String password, Long msv) {

        if (username == null || username.trim().isEmpty()) {
            throw new RuntimeException("Username không được để trống");
        }

        if (password == null || password.trim().isEmpty()) {
            throw new RuntimeException("Password không được để trống");
        }

        if (userPort.existsByUsername(username.trim())) {
            throw new RuntimeException("Username đã tồn tại");
        }

        SinhVien sv = sinhVienPort.timTheoId(msv)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sinh viên"));

        User user = User.builder()
                .username(username.trim())
                .password(passwordEncoder.encode(password))
                .role(Role.STUDENT)
                .sinhVien(sv)
                .build();

        return userPort.save(user);
    }

    @Override
    public User createTeacherAccount(String username, String password, Long maGiaoVien) {

        if (username == null || username.trim().isEmpty()) {
            throw new RuntimeException("Username không được để trống");
        }

        if (password == null || password.trim().isEmpty()) {
            throw new RuntimeException("Password không được để trống");
        }

        if (userPort.existsByUsername(username.trim())) {
            throw new RuntimeException("Username đã tồn tại");
        }

        GiaoVien gv = giaoVienPort.timTheoId(maGiaoVien)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy giáo viên"));

        User user = User.builder()
                .username(username.trim())
                .password(passwordEncoder.encode(password))
                .role(Role.TEACHER)
                .giaoVien(gv)
                .build();

        return userPort.save(user);
    }
}