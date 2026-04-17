package com.nckh.htql_thi.application.port.in;

import com.nckh.htql_thi.domain.entity.DiemThi;
import com.nckh.htql_thi.domain.entity.SinhVien;

import java.util.List;

public interface ManageStudentUseCase {

    SinhVien getMyInfo(String username);

    List<DiemThi> getMyScores(String username);
}