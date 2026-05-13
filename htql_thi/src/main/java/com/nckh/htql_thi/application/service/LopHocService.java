package com.nckh.htql_thi.application.service;

import com.nckh.htql_thi.application.port.in.ManageLopHocUseCase;
import com.nckh.htql_thi.application.port.out.*;
import com.nckh.htql_thi.domain.entity.*;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

@Service
public class LopHocService implements ManageLopHocUseCase {

    private final LopHocPort lopHocPort;
    private final MonHocPort monHocPort;
    private final GiaoVienPort giaoVienPort;
    private final HocKiPort hocKiPort;
    private final SinhVienPort sinhVienPort;

    public LopHocService(LopHocPort lopHocPort, MonHocPort monHocPort, GiaoVienPort giaoVienPort, HocKiPort hocKiPort, SinhVienPort sinhVienPort) {
        this.lopHocPort = lopHocPort;
        this.monHocPort = monHocPort;
        this.giaoVienPort = giaoVienPort;
        this.hocKiPort = hocKiPort;
        this.sinhVienPort = sinhVienPort;
    }

    @Override
    public List<LopHoc> getAllLopHoc() { return lopHocPort.layTatCa(); }

    @Override
    public LopHoc getLopHocById(Long id) {
        return lopHocPort.timTheoId(id).orElseThrow(() -> new RuntimeException("Không tìm thấy lớp học"));
    }

    @Override
    public LopHoc createLopHoc(LopHoc req) {
        MonHoc monHoc = monHocPort.timTheoId(req.getMonHoc().getMaMonHoc()).orElseThrow();
        GiaoVien giaoVien = giaoVienPort.timTheoId(req.getGiaoVien().getMaGiaoVien()).orElseThrow();
        HocKi hocKi = hocKiPort.timTheoId(req.getHocKi().getMaHocKi()).orElseThrow();

        LopHoc lopHoc = LopHoc.builder()
                .monHoc(monHoc).giaoVien(giaoVien).hocKi(hocKi)
                .nhom(req.getNhom())
                .phongHoc(req.getPhongHoc())
                .tietBatDau(req.getTietBatDau())
                .thoiGian(req.getThoiGian())
                .dsSinhVien(new ArrayList<>())
                .build();
        return lopHocPort.luu(lopHoc);
    }

    @Override
    public LopHoc updateLopHoc(Long maLopHoc, LopHoc req) {
        LopHoc lopHoc = getLopHocById(maLopHoc);
        lopHoc.setMonHoc(monHocPort.timTheoId(req.getMonHoc().getMaMonHoc()).orElseThrow());
        lopHoc.setGiaoVien(giaoVienPort.timTheoId(req.getGiaoVien().getMaGiaoVien()).orElseThrow());
        lopHoc.setHocKi(hocKiPort.timTheoId(req.getHocKi().getMaHocKi()).orElseThrow());
        
        lopHoc.setNhom(req.getNhom());
        lopHoc.setPhongHoc(req.getPhongHoc());
        lopHoc.setTietBatDau(req.getTietBatDau());
        lopHoc.setThoiGian(req.getThoiGian());
        
        return lopHocPort.luu(lopHoc);
    }

    @Override
    public void deleteLopHoc(Long id) { lopHocPort.xoa(id); }

    @Override
    public LopHoc removeSinhVienFromLop(Long maLopHoc, Long msv) {
        LopHoc lopHoc = getLopHocById(maLopHoc);
        lopHoc.getDsSinhVien().removeIf(sv -> sv.getMsv().equals(msv));
        return lopHocPort.luu(lopHoc);
    }

    @Override
    @Transactional
    public void importSinhVienExcel(Long maLopHoc, InputStream inputStream) {
        LopHoc lopHoc = lopHocPort.timTheoId(maLopHoc)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy Lớp học với ID: " + maLopHoc));
            
    Khoa khoaMonHoc = lopHoc.getMonHoc().getKhoa();
    DataFormatter formatter = new DataFormatter();

    try (Workbook workbook = new XSSFWorkbook(inputStream)) {
        Sheet sheet = workbook.getSheetAt(0);
        
        for (int i = 1; i <= sheet.getLastRowNum(); i++) {
            Row row = sheet.getRow(i);
            if (row == null) continue;

            String msvStr = formatter.formatCellValue(row.getCell(1));
            if (msvStr.isEmpty()) continue;

            SinhVien sv = sinhVienPort.timTheoId(Long.parseLong(msvStr))
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy sinh viên có mã: " + msvStr));

            if (!sv.getKhoa().getMaKhoa().equals(khoaMonHoc.getMaKhoa())) {
                throw new RuntimeException("Sinh viên " + sv.getHoTen() + " không thuộc khoa " + khoaMonHoc.getTenKhoa());
            }

            if (lopHoc.getDsSinhVien().stream().noneMatch(s -> s.getMsv().equals(sv.getMsv()))) {
                lopHoc.getDsSinhVien().add(sv);
            }
        }

        lopHocPort.luu(lopHoc);
        
    } catch (Exception e) {
        throw new RuntimeException("Lỗi import Excel: " + e.getMessage());
    }
}
}