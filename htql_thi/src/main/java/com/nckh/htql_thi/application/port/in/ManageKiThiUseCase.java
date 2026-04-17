package com.nckh.htql_thi.application.port.in;

import com.nckh.htql_thi.domain.entity.KiThi;

import java.util.List;

public interface ManageKiThiUseCase {

    List<KiThi> getAllKiThi();

    KiThi getKiThiById(Long id);

    KiThi createKiThi(String tenKiThi, Long maHocKi);

    void deleteKiThi(Long id);
}