package com.nckh.htql_thi.infrastructure.repository;

import com.nckh.htql_thi.domain.entity.LopHoc;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LopHocRepository extends JpaRepository<LopHoc, Long> {

    List<LopHoc> findByHocKi_MaHocKi(Long maHocKi);

    List<LopHoc> findByGiaoVien_MaGiaoVien(Long maGiaoVien);
}