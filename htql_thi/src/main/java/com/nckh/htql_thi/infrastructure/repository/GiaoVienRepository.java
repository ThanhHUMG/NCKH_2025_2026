package com.nckh.htql_thi.infrastructure.repository;

import com.nckh.htql_thi.domain.entity.GiaoVien;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GiaoVienRepository extends JpaRepository<GiaoVien, Long> {

    boolean existsByEmail(String email);

    boolean existsBySoDienThoai(String soDienThoai);
}