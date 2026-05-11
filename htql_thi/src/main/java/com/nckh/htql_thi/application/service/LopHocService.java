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
    public LopHoc createLopHoc(Long maMonHoc, Long maGiaoVien, Long maHocKi) {
        MonHoc monHoc = monHocPort.timTheoId(maMonHoc).orElseThrow(() -> new RuntimeException("Không tìm thấy môn học"));
        GiaoVien giaoVien = giaoVienPort.timTheoId(maGiaoVien).orElseThrow(() -> new RuntimeException("Không tìm thấy giáo viên"));
        HocKi hocKi = hocKiPort.timTheoId(maHocKi).orElseThrow(() -> new RuntimeException("Không tìm thấy học kỳ"));

        LopHoc lopHoc = LopHoc.builder().monHoc(monHoc).giaoVien(giaoVien).hocKi(hocKi).dsSinhVien(new ArrayList<>()).build();
        return lopHocPort.luu(lopHoc);
    }

    @Override
    public LopHoc updateLopHoc(Long maLopHoc, Long maMonHoc, Long maGiaoVien, Long maHocKi) {
        LopHoc lopHoc = getLopHocById(maLopHoc);
        lopHoc.setMonHoc(monHocPort.timTheoId(maMonHoc).orElseThrow());
        lopHoc.setGiaoVien(giaoVienPort.timTheoId(maGiaoVien).orElseThrow());
        lopHoc.setHocKi(hocKiPort.timTheoId(maHocKi).orElseThrow());
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
        LopHoc lopHoc = getLopHocById(maLopHoc);
        Khoa khoaMonHoc = lopHoc.getMonHoc().getKhoa();

        try (Workbook workbook = new XSSFWorkbook(inputStream)) {
            Sheet sheet = workbook.getSheetAt(0);
            for (Row row : sheet) {
                if (row.getRowNum() == 0) continue;
                Cell cell = row.getCell(0);
                if (cell == null) continue;
                String msvStr = cell.getCellType() == CellType.STRING ? cell.getStringCellValue() : String.valueOf((long) cell.getNumericCellValue());
                if (msvStr.isEmpty()) continue;

                Long msv = Long.parseLong(msvStr);
                SinhVien sv = sinhVienPort.timTheoId(msv).orElseThrow(() -> new RuntimeException("Không tìm thấy SV: " + msv));

                if (!sv.getKhoa().getMaKhoa().equals(khoaMonHoc.getMaKhoa())) {
                    throw new RuntimeException("Sinh viên " + sv.getHoTen() + " không thuộc khoa " + khoaMonHoc.getTenKhoa());
                }

                boolean exists = lopHoc.getDsSinhVien().stream().anyMatch(s -> s.getMsv().equals(sv.getMsv()));
                if (!exists) lopHoc.getDsSinhVien().add(sv);
            }
            lopHocPort.luu(lopHoc);
        } catch (Exception e) {
            throw new RuntimeException("Lỗi import Excel: " + e.getMessage());
        }
    }
}