package com.nckh.htql_thi.application.service;

import com.nckh.htql_thi.application.port.in.ManageTeacherUseCase;
import com.nckh.htql_thi.application.port.out.*;
import com.nckh.htql_thi.domain.entity.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TeacherService implements ManageTeacherUseCase {

    private final UserPort userPort;
    private final DiemThiPort diemThiPort;
    private final SinhVienPort sinhVienPort;
    private final LopHocPort lopHocPort;
    private final LichThiPort lichThiPort;

    public TeacherService(UserPort userPort, DiemThiPort diemThiPort, SinhVienPort sinhVienPort, LopHocPort lopHocPort, LichThiPort lichThiPort) {
        this.userPort = userPort;
        this.diemThiPort = diemThiPort;
        this.sinhVienPort = sinhVienPort;
        this.lopHocPort = lopHocPort;
        this.lichThiPort = lichThiPort;
    }

    @Override
    public GiaoVien getMyInfo(String username) {
        User user = userPort.findByUsername(username).orElseThrow(() -> new RuntimeException("Không tìm thấy user"));
        if (user.getGiaoVien() == null) throw new RuntimeException("Tài khoản không gắn giáo viên");
        return user.getGiaoVien();
    }

    @Override
    public List<LopHoc> getMyLopHoc(String username) {
        return lopHocPort.findByGiaoVien(getMyInfo(username).getMaGiaoVien());
    }

    @Override
    public List<LichThi> getMyLichThi(String username) {
        return lichThiPort.findByGiaoVien(getMyInfo(username).getMaGiaoVien());
    }

    @Override
    @Transactional
    public DiemThi nhapDiemBC(String username, Long maLopHoc, Long msv, Double diemB, Double diemC) {
        Long maGiaoVien = getMyInfo(username).getMaGiaoVien();
        LopHoc lopHoc = lopHocPort.timTheoId(maLopHoc).orElseThrow(() -> new RuntimeException("Không tìm thấy lớp học"));

        if (!lopHoc.getGiaoVien().getMaGiaoVien().equals(maGiaoVien)) {
            throw new RuntimeException("Bạn không có quyền nhập điểm cho lớp này");
        }

        SinhVien sinhVien = sinhVienPort.timTheoId(msv).orElseThrow(() -> new RuntimeException("Không tìm thấy sinh viên"));
        if (diemB < 0 || diemB > 10 || diemC < 0 || diemC > 10) throw new RuntimeException("Điểm không hợp lệ");

        DiemThi diemThi = diemThiPort.findBySinhVienAndLopHoc(msv, maLopHoc)
                .orElse(DiemThi.builder().sinhVien(sinhVien).lopHoc(lopHoc).build());

        diemThi.setDiemB(diemB);
        diemThi.setDiemC(diemC);
        diemThi.tinhDiem(); // Logic Domain
        return diemThiPort.luu(diemThi);
    }
}