package com.nckh.htql_thi.application.service;

import com.nckh.htql_thi.application.port.in.ManageTeacherUseCase;
import com.nckh.htql_thi.application.port.out.DiemThiPort;
import com.nckh.htql_thi.application.port.out.MonThiPort;
import com.nckh.htql_thi.application.port.out.SinhVienPort;
import com.nckh.htql_thi.application.port.out.UserPort;
import com.nckh.htql_thi.domain.entity.DiemThi;
import com.nckh.htql_thi.domain.entity.MonThi;
import com.nckh.htql_thi.domain.entity.SinhVien;
import com.nckh.htql_thi.domain.entity.User;
import com.nckh.htql_thi.application.port.out.LopHocPort;
import com.nckh.htql_thi.domain.entity.LopHoc;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TeacherService implements ManageTeacherUseCase {

    private final UserPort userPort;
    private final MonThiPort monThiPort;
    private final DiemThiPort diemThiPort;
    private final SinhVienPort sinhVienPort;
    private final LopHocPort lopHocPort;

    public TeacherService(UserPort userPort,
                          MonThiPort monThiPort,
                          DiemThiPort diemThiPort,
                        SinhVienPort sinhVienPort,
            LopHocPort lopHocPort) {
        this.userPort = userPort;
        this.monThiPort = monThiPort;
        this.diemThiPort = diemThiPort;
        this.sinhVienPort = sinhVienPort;
        this.lopHocPort = lopHocPort;
    }
    
    @Override
    public List<LopHoc> getMyLopHoc(String username) {
        User user = userPort.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user"));

        if (user.getGiaoVien() == null) {
            throw new RuntimeException("User này không phải giáo viên");
        }

        Long maGiaoVien = user.getGiaoVien().getMaGiaoVien();
        return lopHocPort.findByGiaoVien(maGiaoVien);
    }

    @Override
    public List<MonThi> getMyMonThi(String username) {

        User user = userPort.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user"));

        if (user.getGiaoVien() == null) {
            throw new RuntimeException("User này không phải giáo viên");
        }

        Long maGiaoVien = user.getGiaoVien().getMaGiaoVien();

        return monThiPort.findByGiaoVien(maGiaoVien);
    }

    @Override
    public List<DiemThi> getScoresOfMonThi(String username, Long maMonThi) {

        User user = userPort.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user"));

        if (user.getGiaoVien() == null) {
            throw new RuntimeException("User này không phải giáo viên");
        }

        Long maGiaoVien = user.getGiaoVien().getMaGiaoVien();

        MonThi monThi = monThiPort.timTheoId(maMonThi)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy môn thi"));

        if (monThi.getLopHoc() == null || monThi.getLopHoc().getGiaoVien() == null) {
            throw new RuntimeException("Môn thi chưa có lớp học hoặc giáo viên");
        }

        if (!monThi.getLopHoc().getGiaoVien().getMaGiaoVien().equals(maGiaoVien)) {
            throw new RuntimeException("Bạn không có quyền xem môn thi này");
        }

        return diemThiPort.findByMonThi(maMonThi);
    }

    @Override
    public DiemThi nhapDiem(String username, Long maMonThi, Long msv,
                            Double diemA, Double diemB, Double diemC) {

        User user = userPort.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user"));

        if (user.getGiaoVien() == null) {
            throw new RuntimeException("User này không phải giáo viên");
        }

        Long maGiaoVien = user.getGiaoVien().getMaGiaoVien();

        MonThi monThi = monThiPort.timTheoId(maMonThi)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy môn thi"));

        if (monThi.getLopHoc() == null || monThi.getLopHoc().getGiaoVien() == null) {
            throw new RuntimeException("Môn thi chưa có lớp học hoặc giáo viên");
        }

        if (!monThi.getLopHoc().getGiaoVien().getMaGiaoVien().equals(maGiaoVien)) {
            throw new RuntimeException("Bạn không có quyền nhập điểm môn thi này");
        }

        SinhVien sinhVien = sinhVienPort.timTheoId(msv)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sinh viên"));

        validateDiem(diemA, "diemA");
        validateDiem(diemB, "diemB");
        validateDiem(diemC, "diemC");

        DiemThi diemThi = diemThiPort.findBySinhVienAndMonThi(msv, maMonThi)
                .orElse(DiemThi.builder()
                        .sinhVien(sinhVien)
                        .monThi(monThi)
                        .build());

        diemThi.setDiemA(diemA);
        diemThi.setDiemB(diemB);
        diemThi.setDiemC(diemC);

        return diemThiPort.luu(diemThi);
    }

    private void validateDiem(Double diem, String field) {
        if (diem == null) {
            throw new RuntimeException(field + " không được null");
        }
        if (diem < 0 || diem > 10) {
            throw new RuntimeException(field + " phải nằm trong khoảng 0 - 10");
        }
    }
}