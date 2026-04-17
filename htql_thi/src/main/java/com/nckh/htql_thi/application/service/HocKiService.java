package com.nckh.htql_thi.application.service;

import com.nckh.htql_thi.application.port.in.ManageHocKiUseCase;
import com.nckh.htql_thi.application.port.out.HocKiPort;
import com.nckh.htql_thi.domain.entity.HocKi;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

@Service
public class HocKiService implements ManageHocKiUseCase {

    private final HocKiPort hocKiPort;

    public HocKiService(HocKiPort hocKiPort) {
        this.hocKiPort = hocKiPort;
    }

    @Override
    public List<HocKi> getAllHocKi() {
        return hocKiPort.layTatCa();
    }

    @Override
    public HocKi getHocKiById(Long id) {
        return hocKiPort.timTheoId(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy học kỳ ID: " + id));
    }

    @Override
    public HocKi createHocKi(HocKi hocKi) {
        if (hocKi.getTenHocKy() == null || hocKi.getTenHocKy().trim().isEmpty()) {
            throw new RuntimeException("Tên học kỳ không được để trống");
        }

        hocKi.setMaHocKi(null);
        hocKi.setTenHocKy(hocKi.getTenHocKy().trim());

        return hocKiPort.luu(hocKi);
    }

    @Override
    public HocKi updateHocKi(Long id, HocKi details) {
        HocKi hocKi = getHocKiById(id);

        if (details.getTenHocKy() == null || details.getTenHocKy().trim().isEmpty()) {
            throw new RuntimeException("Tên học kỳ không được để trống");
        }

        hocKi.setTenHocKy(details.getTenHocKy().trim());

        return hocKiPort.luu(hocKi);
    }

    @Override
    public void deleteHocKi(Long id) {
        hocKiPort.xoa(id);
    }

    // ====================== IMPORT EXCEL ======================
    // Cột A: tenHocKy
    @Override
    @Transactional
    public void importExcel(InputStream inputStream) {
        try (Workbook workbook = new XSSFWorkbook(inputStream)) {

            Sheet sheet = workbook.getSheetAt(0);
            List<HocKi> list = new ArrayList<>();

            for (Row row : sheet) {
                if (row.getRowNum() == 0) continue;

                String tenHocKy = getCellString(row.getCell(0));

                if (tenHocKy == null || tenHocKy.trim().isEmpty()) {
                    continue;
                }

                HocKi hocKi = new HocKi();
                hocKi.setTenHocKy(tenHocKy.trim());

                list.add(hocKi);
            }

            hocKiPort.luuDanhSach(list);

        } catch (Exception e) {
            throw new RuntimeException("Lỗi đọc file Excel Học Kỳ: " + e.getMessage());
        }
    }

    // ====================== HELPER ======================
    private String getCellString(Cell cell) {
        if (cell == null) return null;

        if (cell.getCellType() == CellType.STRING) {
            return cell.getStringCellValue().trim();
        }

        if (cell.getCellType() == CellType.NUMERIC) {
            return String.valueOf((long) cell.getNumericCellValue());
        }

        if (cell.getCellType() == CellType.BOOLEAN) {
            return String.valueOf(cell.getBooleanCellValue());
        }

        if (cell.getCellType() == CellType.FORMULA) {
            try {
                return cell.getStringCellValue().trim();
            } catch (Exception e) {
                return String.valueOf((long) cell.getNumericCellValue());
            }
        }

        return null;
    }
}