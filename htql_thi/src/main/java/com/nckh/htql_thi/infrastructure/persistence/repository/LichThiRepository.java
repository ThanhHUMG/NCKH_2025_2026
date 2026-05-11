package com.nckh.htql_thi.infrastructure.persistence.repository;

import com.nckh.htql_thi.infrastructure.persistence.entity.LichThiJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LichThiRepository extends JpaRepository<LichThiJpaEntity, Long> {
    List<LichThiJpaEntity> findByKiThi_MaKiThi(Long maKiThi);
    
    List<LichThiJpaEntity> findByGiaoVienCoiThi_MaGiaoVien(Long maGiaoVien);
    
    List<LichThiJpaEntity> findByDsSinhVien_Msv(Long msv);
}