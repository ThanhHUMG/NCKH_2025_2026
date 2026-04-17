package com.nckh.htql_thi.application.port.out;

import com.nckh.htql_thi.domain.entity.SinhVien;

import java.util.List;
import java.util.Optional;

public interface SinhVienPort {

    List<SinhVien> layTatCa();

    Optional<SinhVien> timTheoId(Long id);

    SinhVien luu(SinhVien sinhVien);

    void xoa(Long id);

    void luuDanhSach(List<SinhVien> list);

    boolean existsByEmail(String email);

    boolean existsBySoDienThoai(String soDienThoai);
}