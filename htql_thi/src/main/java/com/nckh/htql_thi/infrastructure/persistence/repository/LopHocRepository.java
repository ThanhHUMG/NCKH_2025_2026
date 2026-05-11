package com.nckh.htql_thi.infrastructure.persistence.repository;
import com.nckh.htql_thi.infrastructure.persistence.entity.LopHocJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LopHocRepository extends JpaRepository<LopHocJpaEntity, Long> {
    List<LopHocJpaEntity> findByGiaoVien_MaGiaoVien(Long maGiaoVien);
    List<LopHocJpaEntity> findByHocKi_MaHocKi(Long maHocKi);
}