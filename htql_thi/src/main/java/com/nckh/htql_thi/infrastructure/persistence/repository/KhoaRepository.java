package com.nckh.htql_thi.infrastructure.persistence.repository;
import com.nckh.htql_thi.infrastructure.persistence.entity.KhoaJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface KhoaRepository extends JpaRepository<KhoaJpaEntity, Long> {
    Optional<KhoaJpaEntity> findByTenKhoa(String tenKhoa);
    boolean existsByTenKhoa(String tenKhoa);
}