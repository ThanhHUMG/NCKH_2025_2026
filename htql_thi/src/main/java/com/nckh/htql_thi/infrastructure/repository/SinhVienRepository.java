package com.nckh.htql_thi.infrastructure.repository;

import com.nckh.htql_thi.domain.entity.SinhVien;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SinhVienRepository extends JpaRepository<SinhVien, Long> {

    boolean existsByEmail(String email);

    boolean existsBySoDienThoai(String soDienThoai);
}