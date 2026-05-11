package com.nckh.htql_thi.application.port.out;

import com.nckh.htql_thi.domain.entity.LichThi;
import java.util.List;
import java.util.Optional;

public interface LichThiPort {
    List<LichThi> layTatCa();
    Optional<LichThi> timTheoId(Long id);
    LichThi luu(LichThi lichThi);
    void luuDanhSach(List<LichThi> list);
    void xoa(Long id);
    List<LichThi> findByKiThi(Long maKiThi);
    List<LichThi> findByGiaoVien(Long maGiaoVien);
    List<LichThi> findBySinhVien(Long msv);
}