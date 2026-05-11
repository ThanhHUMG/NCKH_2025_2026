package com.nckh.htql_thi.infrastructure.persistence.repository;
import com.nckh.htql_thi.infrastructure.persistence.entity.GiaoVienJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GiaoVienRepository extends JpaRepository<GiaoVienJpaEntity, Long> {
    boolean existsByEmail(String email);
    boolean existsBySoDienThoai(String soDienThoai);
}