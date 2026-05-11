package com.nckh.htql_thi.application.service;

import com.nckh.htql_thi.application.port.in.ManageMonHocUseCase;
import com.nckh.htql_thi.application.port.out.KhoaPort;
import com.nckh.htql_thi.application.port.out.MonHocPort;
import com.nckh.htql_thi.domain.entity.Khoa;
import com.nckh.htql_thi.domain.entity.MonHoc;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

@Service
public class MonHocService implements ManageMonHocUseCase {

    private final MonHocPort monHocPort;
    private final KhoaPort khoaPort;

    public MonHocService(MonHocPort monHocPort, KhoaPort khoaPort) {
        this.monHocPort = monHocPort;
        this.khoaPort = khoaPort;
    }

    @Override
    public List<MonHoc> getAllMonHoc() { return monHocPort.layTatCa(); }

    @Override
    public MonHoc getMonHocById(Long id) {
        return monHocPort.timTheoId(id).orElseThrow(() -> new RuntimeException("Không tìm thấy môn học ID: " + id));
    }

    @Override
    public MonHoc createMonHoc(MonHoc monHoc) {
        if (monHoc.getTenMonHoc() == null || monHoc.getTenMonHoc().trim().isEmpty()) throw new RuntimeException("Tên môn học không được để trống");
        if (monHoc.getKhoa() == null) throw new RuntimeException("Môn học phải thuộc khoa");

        monHoc.setMaMonHoc(null);
        monHoc.setTenMonHoc(monHoc.getTenMonHoc().trim());
        return monHocPort.luu(monHoc);
    }

    @Override
    public MonHoc updateMonHoc(Long id, MonHoc details) {
        MonHoc monHoc = getMonHocById(id);
        if (details.getTenMonHoc() == null || details.getTenMonHoc().trim().isEmpty()) throw new RuntimeException("Tên môn học không được để trống");

        monHoc.setTenMonHoc(details.getTenMonHoc().trim());
        monHoc.setTinChi(details.getTinChi());
        monHoc.setKhoa(details.getKhoa());
        return monHocPort.luu(monHoc);
    }

    @Override
    public void deleteMonHoc(Long id) { monHocPort.xoa(id); }

    @Override
    @Transactional
    public void importExcel(InputStream inputStream) {
        try (Workbook workbook = new XSSFWorkbook(inputStream)) {
            Sheet sheet = workbook.getSheetAt(0);
            List<MonHoc> list = new ArrayList<>();

            for (Row row : sheet) {
                if (row.getRowNum() == 0) continue;
                String tenMonHoc = getCellString(row.getCell(0));
                Integer tinChi = getCellInteger(row.getCell(1));
                String tenKhoa = getCellString(row.getCell(2));

                if (tenMonHoc == null || tenMonHoc.isEmpty()) continue;
                if (tenKhoa == null || tenKhoa.isEmpty()) throw new RuntimeException("Dòng " + (row.getRowNum() + 1) + ": Thiếu tên khoa");

                Khoa khoa = khoaPort.timTheoTen(tenKhoa.trim()).orElseThrow(() -> new RuntimeException("Không tìm thấy khoa: " + tenKhoa));
                list.add(MonHoc.builder().tenMonHoc(tenMonHoc).tinChi(tinChi).khoa(khoa).build());
            }
            monHocPort.luuDanhSach(list);
        } catch (Exception e) {
            throw new RuntimeException("Lỗi đọc file Excel Môn Học: " + e.getMessage());
        }
    }

    private String getCellString(Cell cell) {
        if (cell == null) return null;
        if (cell.getCellType() == CellType.STRING) return cell.getStringCellValue().trim();
        if (cell.getCellType() == CellType.NUMERIC) return String.valueOf((long) cell.getNumericCellValue());
        return null;
    }

    private Integer getCellInteger(Cell cell) {
        try {
            String val = getCellString(cell);
            return (val == null || val.isEmpty()) ? null : Integer.parseInt(val);
        } catch (Exception e) { return null; }
    }
}