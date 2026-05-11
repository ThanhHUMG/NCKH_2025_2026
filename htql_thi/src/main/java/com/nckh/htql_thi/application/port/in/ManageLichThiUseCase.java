package com.nckh.htql_thi.application.port.in;

import com.nckh.htql_thi.domain.entity.LichThi;
import java.io.InputStream;
import java.util.List;

public interface ManageLichThiUseCase {
    List<LichThi> getAllLichThi();
    LichThi getLichThiById(Long id);
    List<LichThi> getLichThiByKiThi(Long maKiThi);
    void deleteLichThi(Long id);
    void phanCongCoiThi(Long maLichThi, Long maGiaoVien);
    // Import danh sách sinh viên thi và tự động phân phòng
    void importExcelLichThi(Long maKiThi, InputStream inputStream);
}