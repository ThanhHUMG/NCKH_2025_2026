package com.nckh.htql_thi.infrastructure.persistence.repository;
import com.nckh.htql_thi.infrastructure.persistence.entity.DiemThiJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface DiemThiRepository extends JpaRepository<DiemThiJpaEntity, Long> {
    Optional<DiemThiJpaEntity> findBySinhVien_MsvAndLopHoc_MaLopHoc(Long msv, Long maLopHoc);
    List<DiemThiJpaEntity> findByLopHoc_MaLopHoc(Long maLopHoc);
    List<DiemThiJpaEntity> findBySinhVien_Msv(Long msv);
}