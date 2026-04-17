package com.nckh.htql_thi.application.service;

import com.nckh.htql_thi.application.port.in.ManageStudentUseCase;
import com.nckh.htql_thi.application.port.out.DiemThiPort;
import com.nckh.htql_thi.application.port.out.UserPort;
import com.nckh.htql_thi.domain.entity.DiemThi;
import com.nckh.htql_thi.domain.entity.SinhVien;
import com.nckh.htql_thi.domain.entity.User;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService implements ManageStudentUseCase {

    private final UserPort userPort;
    private final DiemThiPort diemThiPort;

    public StudentService(UserPort userPort, DiemThiPort diemThiPort) {
        this.userPort = userPort;
        this.diemThiPort = diemThiPort;
    }

    @Override
    public SinhVien getMyInfo(String username) {

        User user = userPort.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user"));

        if (user.getSinhVien() == null) {
            throw new RuntimeException("Tài khoản không gắn sinh viên");
        }

        return user.getSinhVien();
    }

    @Override
    public List<DiemThi> getMyScores(String username) {

        User user = userPort.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user"));

        if (user.getSinhVien() == null) {
            throw new RuntimeException("Tài khoản không gắn sinh viên");
        }

        return diemThiPort.findBySinhVien(user.getSinhVien().getMsv());
    }
}