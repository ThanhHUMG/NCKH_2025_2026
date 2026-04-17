package com.nckh.htql_thi.application.service;

import com.nckh.htql_thi.application.port.in.ManageLopHocUseCase;
import com.nckh.htql_thi.application.port.out.*;
import com.nckh.htql_thi.domain.entity.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class LopHocService implements ManageLopHocUseCase {

    private final LopHocPort lopHocPort;
    private final MonHocPort monHocPort;
    private final GiaoVienPort giaoVienPort;
    private final HocKiPort hocKiPort;
    private final SinhVienPort sinhVienPort;

    public LopHocService(
            LopHocPort lopHocPort,
            MonHocPort monHocPort,
            GiaoVienPort giaoVienPort,
            HocKiPort hocKiPort,
            SinhVienPort sinhVienPort
    ) {
        this.lopHocPort = lopHocPort;
        this.monHocPort = monHocPort;
        this.giaoVienPort = giaoVienPort;
        this.hocKiPort = hocKiPort;
        this.sinhVienPort = sinhVienPort;
    }

    @Override
    public List<LopHoc> getAllLopHoc() {
        return lopHocPort.layTatCa();
    }

    @Override
    public LopHoc getLopHocById(Long id) {
        return lopHocPort.timTheoId(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lớp học ID: " + id));
    }

    @Override
    @Transactional
    public LopHoc createLopHoc(Long maMonHoc, Long maGiaoVien, Long maHocKi) {

        MonHoc monHoc = monHocPort.timTheoId(maMonHoc)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy môn học ID: " + maMonHoc));

        GiaoVien giaoVien = giaoVienPort.timTheoId(maGiaoVien)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy giáo viên ID: " + maGiaoVien));

        HocKi hocKi = hocKiPort.timTheoId(maHocKi)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy học kỳ ID: " + maHocKi));

        if (giaoVien.getKhoa() == null || monHoc.getKhoa() == null) {
            throw new RuntimeException("Giáo viên và môn học phải thuộc khoa");
        }

        if (!giaoVien.getKhoa().getMaKhoa().equals(monHoc.getKhoa().getMaKhoa())) {
            throw new RuntimeException("Giáo viên phải thuộc cùng khoa với môn học");
        }

        LopHoc lopHoc = new LopHoc();
        lopHoc.setMonHoc(monHoc);
        lopHoc.setGiaoVien(giaoVien);
        lopHoc.setHocKi(hocKi);
        lopHoc.setDsSinhVien(new ArrayList<>());

        return lopHocPort.luu(lopHoc);
    }

    @Override
    @Transactional
    public LopHoc updateLopHoc(Long maLopHoc, Long maMonHoc, Long maGiaoVien, Long maHocKi) {

        LopHoc lopHoc = getLopHocById(maLopHoc);

        MonHoc monHoc = monHocPort.timTheoId(maMonHoc)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy môn học ID: " + maMonHoc));

        GiaoVien giaoVien = giaoVienPort.timTheoId(maGiaoVien)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy giáo viên ID: " + maGiaoVien));

        HocKi hocKi = hocKiPort.timTheoId(maHocKi)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy học kỳ ID: " + maHocKi));

        if (giaoVien.getKhoa() == null || monHoc.getKhoa() == null) {
            throw new RuntimeException("Giáo viên và môn học phải thuộc khoa");
        }

        if (!giaoVien.getKhoa().getMaKhoa().equals(monHoc.getKhoa().getMaKhoa())) {
            throw new RuntimeException("Giáo viên phải thuộc cùng khoa với môn học");
        }

        lopHoc.setMonHoc(monHoc);
        lopHoc.setGiaoVien(giaoVien);
        lopHoc.setHocKi(hocKi);

        return lopHocPort.luu(lopHoc);
    }

    @Override
    @Transactional
    public LopHoc addSinhVienToLop(Long maLopHoc, List<Long> dsMsv) {

        LopHoc lopHoc = getLopHocById(maLopHoc);

        if (lopHoc.getDsSinhVien() == null) {
            lopHoc.setDsSinhVien(new ArrayList<>());
        }

        for (Long msv : dsMsv) {
            SinhVien sv = sinhVienPort.timTheoId(msv)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy sinh viên MSV: " + msv));

            if (!lopHoc.getDsSinhVien().contains(sv)) {
                lopHoc.getDsSinhVien().add(sv);
            }
        }

        return lopHocPort.luu(lopHoc);
    }

    @Override
    @Transactional
    public LopHoc removeSinhVienFromLop(Long maLopHoc, Long msv) {

        LopHoc lopHoc = getLopHocById(maLopHoc);

        if (lopHoc.getDsSinhVien() == null) {
            return lopHoc;
        }

        lopHoc.getDsSinhVien().removeIf(sv -> sv.getMsv().equals(msv));

        return lopHocPort.luu(lopHoc);
    }

    @Override
    public void deleteLopHoc(Long id) {
        lopHocPort.xoa(id);
    }
}