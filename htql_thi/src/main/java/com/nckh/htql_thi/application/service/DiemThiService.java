package com.nckh.htql_thi.application.service;

import com.nckh.htql_thi.application.port.in.ManageDiemThiUseCase;
import com.nckh.htql_thi.application.port.out.DiemThiPort;
import com.nckh.htql_thi.application.port.out.MonThiPort;
import com.nckh.htql_thi.application.port.out.SinhVienPort;
import com.nckh.htql_thi.domain.entity.DiemThi;
import com.nckh.htql_thi.domain.entity.MonThi;
import com.nckh.htql_thi.domain.entity.SinhVien;

import org.springframework.transaction.annotation.Transactional;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DiemThiService implements ManageDiemThiUseCase {

    private final DiemThiPort diemThiPort;
    private final SinhVienPort sinhVienPort;
    private final MonThiPort monThiPort;

    public DiemThiService(DiemThiPort diemThiPort,
                          SinhVienPort sinhVienPort,
                          MonThiPort monThiPort) {
        this.diemThiPort = diemThiPort;
        this.sinhVienPort = sinhVienPort;
        this.monThiPort = monThiPort;
    }

    @Override
    public List<DiemThi> getAllDiemThi() {
        return diemThiPort.layTatCa();
    }

    @Override
    public DiemThi getDiemThiById(Long id) {
        return diemThiPort.timTheoId(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy điểm thi"));
    }

    @Override
    @Transactional
public DiemThi nhapDiem(Long msv, Long maMonThi,
                       Double diemA, Double diemB, Double diemC) {

    if (diemA == null || diemB == null || diemC == null) {
        throw new RuntimeException("Điểm A,B,C không được null");
    }

    if (diemA < 0 || diemA > 10 || diemB < 0 || diemB > 10 || diemC < 0 || diemC > 10) {
        throw new RuntimeException("Điểm phải nằm trong khoảng 0-10");
    }

    SinhVien sinhVien = sinhVienPort.timTheoId(msv)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy sinh viên"));

    MonThi monThi = monThiPort.timTheoId(maMonThi)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy môn thi"));

    DiemThi diemThi;

    var existing = diemThiPort.findBySinhVienAndMonThi(msv, maMonThi);

    if (existing.isPresent()) {
        diemThi = existing.get(); // UPDATE
    } else {
        diemThi = new DiemThi();
        diemThi.setSinhVien(sinhVien);
        diemThi.setMonThi(monThi);
    }

    diemThi.setDiemA(diemA);
    diemThi.setDiemB(diemB);
    diemThi.setDiemC(diemC);

    return diemThiPort.luu(diemThi);
}

    @Override
    public List<DiemThi> getDiemByMonThi(Long maMonThi) {
        return diemThiPort.findByMonThi(maMonThi);
    }

    @Override
    public List<DiemThi> getDiemBySinhVien(Long msv) {
        return diemThiPort.findBySinhVien(msv);
    }

    @Override
    public void deleteDiemThi(Long id) {
        diemThiPort.xoa(id);
    }
}