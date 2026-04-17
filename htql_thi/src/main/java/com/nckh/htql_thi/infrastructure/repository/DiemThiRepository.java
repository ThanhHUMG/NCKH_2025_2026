package com.nckh.htql_thi.infrastructure.repository;

import com.nckh.htql_thi.domain.entity.DiemThi;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DiemThiRepository extends JpaRepository<DiemThi, Long> {

    Optional<DiemThi> findBySinhVien_MsvAndMonThi_MaMonThi(Long msv, Long maMonThi);

    List<DiemThi> findByMonThi_MaMonThi(Long maMonThi);

    List<DiemThi> findBySinhVien_Msv(Long msv);
}