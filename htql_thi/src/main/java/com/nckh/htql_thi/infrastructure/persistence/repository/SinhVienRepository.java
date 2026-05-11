package com.nckh.htql_thi.infrastructure.persistence.repository;
import com.nckh.htql_thi.infrastructure.persistence.entity.SinhVienJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SinhVienRepository extends JpaRepository<SinhVienJpaEntity, Long> {
    boolean existsByEmail(String email);
    boolean existsBySoDienThoai(String soDienThoai);
}