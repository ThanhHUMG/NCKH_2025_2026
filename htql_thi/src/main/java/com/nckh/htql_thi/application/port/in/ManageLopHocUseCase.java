package com.nckh.htql_thi.application.port.in;

import com.nckh.htql_thi.domain.entity.LopHoc;
import java.io.InputStream;
import java.util.List;

public interface ManageLopHocUseCase {
    List<LopHoc> getAllLopHoc();
    LopHoc getLopHocById(Long id);
    LopHoc createLopHoc(Long maMonHoc, Long maGiaoVien, Long maHocKi);
    LopHoc updateLopHoc(Long maLopHoc, Long maMonHoc, Long maGiaoVien, Long maHocKi);
    LopHoc removeSinhVienFromLop(Long maLopHoc, Long msv);
    void deleteLopHoc(Long id);
    void importSinhVienExcel(Long maLopHoc, InputStream inputStream); 
}