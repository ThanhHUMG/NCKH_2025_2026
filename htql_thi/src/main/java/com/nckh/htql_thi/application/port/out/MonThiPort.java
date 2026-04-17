package com.nckh.htql_thi.application.port.out;

import com.nckh.htql_thi.domain.entity.MonThi;

import java.util.List;
import java.util.Optional;

public interface MonThiPort {

    List<MonThi> layTatCa();

    Optional<MonThi> timTheoId(Long id);

    MonThi luu(MonThi monThi);

    void xoa(Long id);

    List<MonThi> findByKiThi(Long maKiThi);

    List<MonThi> findByGiaoVien(Long maGiaoVien);

    boolean existsByLopHocAndKiThi(Long maLopHoc, Long maKiThi);
}