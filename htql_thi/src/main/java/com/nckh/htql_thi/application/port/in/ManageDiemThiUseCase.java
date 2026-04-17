package com.nckh.htql_thi.application.port.in;

import com.nckh.htql_thi.domain.entity.DiemThi;

import java.util.List;

public interface ManageDiemThiUseCase {

    List<DiemThi> getAllDiemThi();

    DiemThi getDiemThiById(Long id);

    DiemThi nhapDiem(Long msv, Long maMonThi, Double diemA, Double diemB, Double diemC);

    List<DiemThi> getDiemByMonThi(Long maMonThi);

    List<DiemThi> getDiemBySinhVien(Long msv);

    void deleteDiemThi(Long id);
}