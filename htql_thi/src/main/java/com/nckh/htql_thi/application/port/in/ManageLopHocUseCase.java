package com.nckh.htql_thi.application.port.in;

import com.nckh.htql_thi.domain.entity.LopHoc;
import java.io.InputStream;
import java.util.List;

public interface ManageLopHocUseCase {
    List<LopHoc> getAllLopHoc();
    LopHoc getLopHocById(Long id);
    LopHoc createLopHoc(LopHoc lopHocReq);
    LopHoc updateLopHoc(Long maLopHoc, LopHoc lopHocReq);
    void deleteLopHoc(Long id);
    LopHoc removeSinhVienFromLop(Long maLopHoc, Long msv);
    void importSinhVienExcel(Long maLopHoc, InputStream inputStream);
}