package com.nckh.htql_thi.application.port.in;

import com.nckh.htql_thi.domain.entity.DiemThi;
import com.nckh.htql_thi.domain.entity.GiaoVien;
import com.nckh.htql_thi.domain.entity.LichThi;
import com.nckh.htql_thi.domain.entity.LopHoc;
import java.util.List;

public interface ManageTeacherUseCase {
    GiaoVien getMyInfo(String username);
    List<LopHoc> getMyLopHoc(String username);
    List<LichThi> getMyLichThi(String username);
    
    // Giáo viên chỉ nhập điểm quá trình (B, C)
    DiemThi nhapDiemBC(String username, Long maLopHoc, Long msv, Double diemB, Double diemC);
}