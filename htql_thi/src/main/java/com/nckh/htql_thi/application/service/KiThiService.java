package com.nckh.htql_thi.application.service;

import com.nckh.htql_thi.application.port.in.ManageKiThiUseCase;
import com.nckh.htql_thi.application.port.out.HocKiPort;
import com.nckh.htql_thi.application.port.out.KiThiPort;
import com.nckh.htql_thi.domain.entity.HocKi;
import com.nckh.htql_thi.domain.entity.KiThi;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class KiThiService implements ManageKiThiUseCase {

    private final KiThiPort kiThiPort;
    private final HocKiPort hocKiPort;

    public KiThiService(KiThiPort kiThiPort, HocKiPort hocKiPort) {
        this.kiThiPort = kiThiPort;
        this.hocKiPort = hocKiPort;
    }

    @Override
    public List<KiThi> getAllKiThi() { return kiThiPort.layTatCa(); }

    @Override
    public KiThi getKiThiById(Long id) {
        return kiThiPort.timTheoId(id).orElseThrow(() -> new RuntimeException("Không tìm thấy kỳ thi ID: " + id));
    }

    @Override
    @Transactional
    public KiThi createKiThi(String tenKiThi, Long maHocKi) {
        if (tenKiThi == null || tenKiThi.trim().isEmpty()) throw new RuntimeException("Tên kỳ thi không được để trống");
        HocKi hocKi = hocKiPort.timTheoId(maHocKi).orElseThrow(() -> new RuntimeException("Không tìm thấy học kỳ ID: " + maHocKi));

        KiThi kiThi = KiThi.builder().tenKiThi(tenKiThi.trim()).hocKi(hocKi).build();
        return kiThiPort.luu(kiThi);
    }

    @Override
    public void deleteKiThi(Long id) { kiThiPort.xoa(id); }
}