package com.nckh.htql_thi.application.port.in;

import com.nckh.htql_thi.domain.entity.MonThi;
import com.nckh.htql_thi.domain.entity.SinhVien;

import java.time.LocalDateTime;
import java.util.List;

public interface ManageMonThiUseCase {

    List<MonThi> getAllMonThi();

    MonThi getMonThiById(Long id);

    List<MonThi> getMonThiByKiThi(Long maKiThi);

    MonThi updateMonThi(Long id,
                        String hinhThucThi,
                        String phongThi,
                        LocalDateTime thoiGianThi,
                        List<Long> dsMaGiamThi);

    void deleteMonThi(Long id);

    List<SinhVien> getSinhVienByMonThi(Long maMonThi);
}