package com.nckh.htql_thi.application.port.out;

import com.nckh.htql_thi.domain.entity.GiaoVien;

import java.util.List;
import java.util.Optional;

public interface GiaoVienPort {

    List<GiaoVien> layTatCa();

    Optional<GiaoVien> timTheoId(Long id);

    GiaoVien luu(GiaoVien giaoVien);

    void xoa(Long id);

    void luuDanhSach(List<GiaoVien> list);

    boolean existsByEmail(String email);

    boolean existsBySoDienThoai(String soDienThoai);

    List<GiaoVien> findAllByIds(List<Long> ids);
}