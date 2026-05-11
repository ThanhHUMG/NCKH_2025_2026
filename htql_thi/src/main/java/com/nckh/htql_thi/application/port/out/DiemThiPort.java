package com.nckh.htql_thi.application.port.out;

import com.nckh.htql_thi.domain.entity.DiemThi;
import java.util.List;
import java.util.Optional;

public interface DiemThiPort {
    DiemThi luu(DiemThi diemThi);
    void xoa(Long id);
    Optional<DiemThi> findBySinhVienAndLopHoc(Long msv, Long maLopHoc);
    List<DiemThi> findByLopHoc(Long maLopHoc);
    List<DiemThi> findBySinhVien(Long msv);
}