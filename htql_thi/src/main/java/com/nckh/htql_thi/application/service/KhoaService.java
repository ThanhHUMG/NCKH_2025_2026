package com.nckh.htql_thi.application.service;

import com.nckh.htql_thi.application.port.in.ManageKhoaUseCase;
import com.nckh.htql_thi.application.port.out.KhoaPort;
import com.nckh.htql_thi.domain.entity.Khoa;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

@Service
public class KhoaService implements ManageKhoaUseCase {

    private final KhoaPort khoaPort;

    public KhoaService(KhoaPort khoaPort) {
        this.khoaPort = khoaPort;
    }

    @Override
    public List<Khoa> getAllKhoa() {
        return khoaPort.layTatCa();
    }

    @Override
    public Khoa getKhoaById(Long id) {
        return khoaPort.timTheoId(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khoa ID: " + id));
    }

    @Override
    public Khoa createKhoa(Khoa khoa) {
        if (khoa.getTenKhoa() == null || khoa.getTenKhoa().trim().isEmpty()) {
            throw new RuntimeException("Tên khoa không được để trống");
        }

        String tenKhoa = khoa.getTenKhoa().trim();

        if (khoaPort.existsByTenKhoa(tenKhoa)) {
            throw new RuntimeException("Khoa đã tồn tại: " + tenKhoa);
        }

        khoa.setMaKhoa(null);
        khoa.setTenKhoa(tenKhoa);

        return khoaPort.luu(khoa);
    }

    @Override
    public Khoa updateKhoa(Long id, Khoa details) {
        Khoa khoa = getKhoaById(id);

        if (details.getTenKhoa() == null || details.getTenKhoa().trim().isEmpty()) {
            throw new RuntimeException("Tên khoa không được để trống");
        }

        khoa.setTenKhoa(details.getTenKhoa().trim());
        return khoaPort.luu(khoa);
    }

    @Override
    public void deleteKhoa(Long id) {
        khoaPort.xoa(id);
    }

    // ====================== IMPORT EXCEL ======================
    // Cột A: tenKhoa
    @Override
    @Transactional
    public void importExcel(InputStream inputStream) {
        try (Workbook workbook = new XSSFWorkbook(inputStream)) {

            Sheet sheet = workbook.getSheetAt(0);
            List<Khoa> list = new ArrayList<>();

            for (Row row : sheet) {
                if (row.getRowNum() == 0) continue;

                String tenKhoa = getCellString(row.getCell(0));

                if (tenKhoa == null || tenKhoa.trim().isEmpty()) {
                    continue;
                }

                tenKhoa = tenKhoa.trim();

                if (khoaPort.existsByTenKhoa(tenKhoa)) {
                    continue; // bỏ qua khoa trùng
                }

                Khoa khoa = new Khoa();
                khoa.setTenKhoa(tenKhoa);

                list.add(khoa);
            }

            khoaPort.luuDanhSach(list);

        } catch (Exception e) {
            throw new RuntimeException("Lỗi đọc file Excel Khoa: " + e.getMessage());
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