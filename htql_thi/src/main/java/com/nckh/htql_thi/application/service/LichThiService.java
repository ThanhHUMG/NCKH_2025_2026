package com.nckh.htql_thi.application.service;

import com.nckh.htql_thi.application.port.in.ManageLichThiUseCase;
import com.nckh.htql_thi.application.port.out.*;
import com.nckh.htql_thi.domain.entity.*;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.InputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class LichThiService implements ManageLichThiUseCase {

    private final LichThiPort lichThiPort;
    private final KiThiPort kiThiPort;
    private final MonHocPort monHocPort;
    private final SinhVienPort sinhVienPort;
    private final GiaoVienPort giaoVienPort;

    public LichThiService(LichThiPort lichThiPort, 
                          KiThiPort kiThiPort, 
                          MonHocPort monHocPort, 
                          SinhVienPort sinhVienPort, 
                          GiaoVienPort giaoVienPort) {
        this.lichThiPort = lichThiPort;
        this.kiThiPort = kiThiPort;
        this.monHocPort = monHocPort;
        this.sinhVienPort = sinhVienPort;
        this.giaoVienPort = giaoVienPort; 
    }

    @Override
    public List<LichThi> getAllLichThi() { return lichThiPort.layTatCa(); }

    @Override
    public LichThi getLichThiById(Long id) { return lichThiPort.timTheoId(id).orElseThrow(); }

    @Override
    public List<LichThi> getLichThiByKiThi(Long maKiThi) { return lichThiPort.findByKiThi(maKiThi); }

    @Override
    public void deleteLichThi(Long id) {
        lichThiPort.xoa(id);
    }

    @Override
    public void phanCongCoiThi(Long maLichThi, Long maGiaoVien) {
        LichThi lichThi = getLichThiById(maLichThi);
        GiaoVien giaoVien = giaoVienPort.timTheoId(maGiaoVien)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy giáo viên"));
        lichThi.setGiaoVienCoiThi(giaoVien);
        lichThiPort.luu(lichThi);
    }

    @Override
    @Transactional
    public void importExcelLichThi(Long maKiThi, InputStream inputStream) {
        KiThi kiThi = kiThiPort.timTheoId(maKiThi)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy kỳ thi"));
    Map<String, LichThi> lichThiMap = new HashMap<>();
    DataFormatter formatter = new DataFormatter();
    DateTimeFormatter dateParser = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    try (Workbook workbook = new XSSFWorkbook(inputStream)) {
        Sheet sheet = workbook.getSheetAt(0);
        for (Row row : sheet) {
            if (row.getRowNum() == 0) continue;
            try {
                String msvStr = formatter.formatCellValue(row.getCell(1)).trim();
                if (msvStr.isEmpty()) continue;
                Long msv = Long.parseLong(msvStr);
                String maMonStr = formatter.formatCellValue(row.getCell(3)).trim();
                Long maMonHoc = Long.parseLong(maMonStr);
                String phongThi = formatter.formatCellValue(row.getCell(5)).trim();
                LocalDate thoiGian;
                Cell dateCell = row.getCell(6);
                if (dateCell.getCellType() == CellType.NUMERIC && DateUtil.isCellDateFormatted(dateCell)) {
                    thoiGian = dateCell.getLocalDateTimeCellValue().toLocalDate();
                } else {
                    thoiGian = LocalDate.parse(formatter.formatCellValue(dateCell), dateParser);
                }
                Integer tietBatDau = Integer.parseInt(formatter.formatCellValue(row.getCell(7)).trim());
                String hinhThucThi = formatter.formatCellValue(row.getCell(8)).trim();
                SinhVien sv = sinhVienPort.timTheoId(msv)
                        .orElseThrow(() -> new RuntimeException("Không tìm thấy SV: " + msv));
                MonHoc monHoc = monHocPort.timTheoId(maMonHoc)
                        .orElseThrow(() -> new RuntimeException("Không tìm thấy Môn: " + maMonHoc));
                String groupKey = maMonHoc + "-" + phongThi + "-" + thoiGian + "-" + tietBatDau;
                LichThi lichThi = lichThiMap.computeIfAbsent(groupKey, k -> 
                    LichThi.builder()
                            .kiThi(kiThi)
                            .monHoc(monHoc)
                            .phongThi(phongThi)
                            .thoiGian(thoiGian)
                            .tietBatDau(tietBatDau)
                            .hinhThucThi(hinhThucThi)
                            .dsSinhVien(new ArrayList<>())
                            .build()
                );
                if (lichThi.getDsSinhVien().stream().noneMatch(s -> s.getMsv().equals(sv.getMsv()))) {
                    lichThi.getDsSinhVien().add(sv);
                }
            } catch (Exception e) {
                throw new RuntimeException("Lỗi tại dòng " + (row.getRowNum() + 1) + ": " + e.getMessage());
            }
        }
        lichThiPort.luuDanhSach(new ArrayList<>(lichThiMap.values()));
    } catch (Exception e) {
        throw new RuntimeException("Lỗi xử lý file: " + e.getMessage());
    }
}
}