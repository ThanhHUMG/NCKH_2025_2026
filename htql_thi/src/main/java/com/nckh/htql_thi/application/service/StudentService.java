package com.nckh.htql_thi.application.service;

import com.nckh.htql_thi.application.port.in.ManageStudentUseCase;
import com.nckh.htql_thi.application.port.out.*;
import com.nckh.htql_thi.domain.entity.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService implements ManageStudentUseCase {

    private final UserPort userPort;
    private final DiemThiPort diemThiPort;
    private final LichThiPort lichThiPort;

    public StudentService(UserPort userPort, DiemThiPort diemThiPort, LichThiPort lichThiPort) {
        this.userPort = userPort;
        this.diemThiPort = diemThiPort;
        this.lichThiPort = lichThiPort;
    }

    @Override
    public SinhVien getMyInfo(String username) {
        User user = userPort.findByUsername(username).orElseThrow(() -> new RuntimeException("Lỗi user"));
        if (user.getSinhVien() == null) throw new RuntimeException("Tài khoản không gắn sinh viên");
        return user.getSinhVien();
    }

    @Override
    public List<DiemThi> getMyScores(String username) {
        return diemThiPort.findBySinhVien(getMyInfo(username).getMsv());
    }

    @Override
    public List<LichThi> getMyLichThi(String username) {
        return lichThiPort.findBySinhVien(getMyInfo(username).getMsv());
    }
}