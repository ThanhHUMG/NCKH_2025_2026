package com.nckh.htql_thi.application.service;

import com.nckh.htql_thi.application.port.in.ManageSinhVienUseCase;
import com.nckh.htql_thi.application.port.out.KhoaPort;
import com.nckh.htql_thi.application.port.out.SinhVienPort;
import com.nckh.htql_thi.domain.entity.Khoa;
import com.nckh.htql_thi.domain.entity.SinhVien;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

@Service
public class SinhVienService implements ManageSinhVienUseCase {

    private final SinhVienPort sinhVienPort;
    private final KhoaPort khoaPort;

    public SinhVienService(SinhVienPort sinhVienPort, KhoaPort khoaPort) {
        this.sinhVienPort = sinhVienPort;
        this.khoaPort = khoaPort;
    }

    @Override
    public List<SinhVien> getAllSinhVien() { return sinhVienPort.layTatCa(); }

    @Override
    public SinhVien getSinhVienById(Long id) {
        return sinhVienPort.timTheoId(id).orElseThrow(() -> new RuntimeException("Không tìm thấy Sinh Viên ID: " + id));
    }

    @Override
    public SinhVien createSinhVien(SinhVien sinhVien) {
        if (sinhVien.getHoTen() == null || sinhVien.getHoTen().trim().isEmpty()) throw new RuntimeException("Họ tên sinh viên không được để trống");
        sinhVien.setMsv(null);
        sinhVien.setHoTen(sinhVien.getHoTen().trim());
        return sinhVienPort.luu(sinhVien);
    }

    @Override
    public SinhVien updateSinhVien(Long id, SinhVien details) {
        SinhVien sv = getSinhVienById(id);
        if (details.getHoTen() == null || details.getHoTen().trim().isEmpty()) throw new RuntimeException("Họ tên không được để trống");

        sv.setHoTen(details.getHoTen().trim());
        sv.setNamSinh(details.getNamSinh());
        sv.setNienKhoa(details.getNienKhoa());
        sv.setSoDienThoai(details.getSoDienThoai());
        sv.setEmail(details.getEmail());
        sv.setDiaChi(details.getDiaChi());
        sv.setKhoa(details.getKhoa());
        return sinhVienPort.luu(sv);
    }

    @Override
    public void deleteSinhVien(Long id) { sinhVienPort.xoa(id); }

    @Override
    @Transactional
    public void importExcel(InputStream inputStream) {
        try (Workbook workbook = new XSSFWorkbook(inputStream)) {
            Sheet sheet = workbook.getSheetAt(0);
            List<SinhVien> list = new ArrayList<>();

            for (Row row : sheet) {
                if (row.getRowNum() == 0) continue;
                String hoTen = getCellString(row.getCell(0));
                Integer namSinh = getCellInteger(row.getCell(1));
                String nienKhoa = getCellString(row.getCell(2));
                String soDienThoai = getCellString(row.getCell(3));
                String email = getCellString(row.getCell(4));
                String diaChi = getCellString(row.getCell(5));
                String tenKhoa = getCellString(row.getCell(6));

                if (hoTen == null || hoTen.isEmpty()) continue;
                if (tenKhoa == null || tenKhoa.isEmpty()) throw new RuntimeException("Dòng " + (row.getRowNum() + 1) + ": Thiếu tên khoa");

                Khoa khoa = khoaPort.timTheoTen(tenKhoa.trim()).orElseThrow(() -> new RuntimeException("Không tìm thấy khoa: " + tenKhoa));
                if (email != null && !email.isEmpty() && sinhVienPort.existsByEmail(email.trim())) continue;
                if (soDienThoai != null && !soDienThoai.isEmpty() && sinhVienPort.existsBySoDienThoai(soDienThoai.trim())) continue;

                list.add(SinhVien.builder()
                        .hoTen(hoTen.trim()).namSinh(namSinh).nienKhoa(nienKhoa)
                        .soDienThoai(soDienThoai).email(email).diaChi(diaChi).khoa(khoa)
                        .build());
            }
            sinhVienPort.luuDanhSach(list);
        } catch (Exception e) {
            throw new RuntimeException("Lỗi đọc file Excel Sinh Viên: " + e.getMessage());
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