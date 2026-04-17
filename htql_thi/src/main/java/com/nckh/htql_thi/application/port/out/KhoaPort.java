package com.nckh.htql_thi.application.port.out;

import com.nckh.htql_thi.domain.entity.Khoa;

import java.util.List;
import java.util.Optional;

public interface KhoaPort {

    List<Khoa> layTatCa();

    Optional<Khoa> timTheoId(Long id);

    Optional<Khoa> timTheoTen(String tenKhoa);

    Khoa luu(Khoa khoa);

    void xoa(Long id);

    void luuDanhSach(List<Khoa> list);

    boolean existsByTenKhoa(String tenKhoa);
}