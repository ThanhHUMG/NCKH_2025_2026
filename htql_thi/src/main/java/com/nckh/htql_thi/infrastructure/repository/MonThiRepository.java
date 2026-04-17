package com.nckh.htql_thi.infrastructure.repository;

import com.nckh.htql_thi.domain.entity.MonThi;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MonThiRepository extends JpaRepository<MonThi, Long> {

    List<MonThi> findByKiThi_MaKiThi(Long maKiThi);

    List<MonThi> findByLopHoc_GiaoVien_MaGiaoVien(Long maGiaoVien);

    boolean existsByLopHoc_MaLopHocAndKiThi_MaKiThi(Long maLopHoc, Long maKiThi);
}