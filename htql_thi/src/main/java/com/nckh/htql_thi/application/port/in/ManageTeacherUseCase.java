package com.nckh.htql_thi.application.port.in;

import com.nckh.htql_thi.domain.entity.LopHoc;
import com.nckh.htql_thi.domain.entity.DiemThi;
import com.nckh.htql_thi.domain.entity.MonThi;

import java.util.List;

public interface ManageTeacherUseCase {
    List<LopHoc> getMyLopHoc(String username);

    List<MonThi> getMyMonThi(String username);

    List<DiemThi> getScoresOfMonThi(String username, Long maMonThi);

    DiemThi nhapDiem(String username, Long maMonThi, Long msv, Double diemA, Double diemB, Double diemC);
}