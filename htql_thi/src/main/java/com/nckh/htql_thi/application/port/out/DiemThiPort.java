package com.nckh.htql_thi.application.port.out;

import com.nckh.htql_thi.domain.entity.DiemThi;

import java.util.List;
import java.util.Optional;

public interface DiemThiPort {

    List<DiemThi> layTatCa();

    Optional<DiemThi> timTheoId(Long id);

    DiemThi luu(DiemThi diemThi);

    void xoa(Long id);

    Optional<DiemThi> findBySinhVienAndMonThi(Long msv, Long maMonThi);

    List<DiemThi> findByMonThi(Long maMonThi);

    List<DiemThi> findBySinhVien(Long msv);
}