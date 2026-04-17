package com.nckh.htql_thi.application.port.out;

import com.nckh.htql_thi.domain.entity.LopHoc;

import java.util.List;
import java.util.Optional;

public interface LopHocPort {

    List<LopHoc> layTatCa();

    Optional<LopHoc> timTheoId(Long id);

    LopHoc luu(LopHoc lopHoc);

    void xoa(Long id);

    List<LopHoc> findByGiaoVien(Long maGiaoVien);

    List<LopHoc> findByHocKi(Long maHocKi);
}