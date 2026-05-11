package com.nckh.htql_thi.application.service;

import com.nckh.htql_thi.application.port.in.ManageGiaoVienUseCase;
import com.nckh.htql_thi.application.port.out.GiaoVienPort;
import com.nckh.htql_thi.application.port.out.KhoaPort;
import com.nckh.htql_thi.domain.entity.GiaoVien;
import com.nckh.htql_thi.domain.entity.Khoa;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

@Service
public class GiaoVienService implements ManageGiaoVienUseCase {

    private final GiaoVienPort giaoVienPort;
    private final KhoaPort khoaPort;

    public GiaoVienService(GiaoVienPort giaoVienPort, KhoaPort khoaPort) {
        this.giaoVienPort = giaoVienPort;
        this.khoaPort = khoaPort;
    }

    @Override
    public List<GiaoVien> getAllGiaoVien() { return giaoVienPort.layTatCa(); }

    @Override
    public GiaoVien getGiaoVienById(Long id) {
        return giaoVienPort.timTheoId(id).orElseThrow(() -> new RuntimeException("Không tìm thấy giáo viên ID: " + id));
    }

    @Override
    public GiaoVien createGiaoVien(GiaoVien giaoVien) {
        if (giaoVien.getHoTen() == null || giaoVien.getHoTen().trim().isEmpty()) throw new RuntimeException("Họ tên không được để trống");
        if (giaoVien.getKhoa() == null) throw new RuntimeException("Giáo viên phải thuộc khoa");
        giaoVien.setMaGiaoVien(null);
        giaoVien.setHoTen(giaoVien.getHoTen().trim());
        return giaoVienPort.luu(giaoVien);
    }

    @Override
    public GiaoVien updateGiaoVien(Long id, GiaoVien details) {
        GiaoVien gv = getGiaoVienById(id);
        if (details.getHoTen() == null || details.getHoTen().trim().isEmpty()) throw new RuntimeException("Họ tên không được để trống");

        gv.setHoTen(details.getHoTen().trim());
        gv.setNamSinh(details.getNamSinh());
        gv.setTrinhDo(details.getTrinhDo());
        gv.setSoDienThoai(details.getSoDienThoai());
        gv.setEmail(details.getEmail());
        gv.setDiaChi(details.getDiaChi());
        gv.setKhoa(details.getKhoa());
        return giaoVienPort.luu(gv);
    }

    @Override
    public void deleteGiaoVien(Long id) { giaoVienPort.xoa(id); }

    @Override
    @Transactional
    public void importExcel(InputStream inputStream) {
        try (Workbook workbook = new XSSFWorkbook(inputStream)) {
            Sheet sheet = workbook.getSheetAt(0);
            List<GiaoVien> list = new ArrayList<>();

            for (Row row : sheet) {
                if (row.getRowNum() == 0) continue;
                String hoTen = getCellString(row.getCell(0));
                Integer namSinh = getCellInteger(row.getCell(1));
                String trinhDo = getCellString(row.getCell(2));
                String soDienThoai = getCellString(row.getCell(3));
                String email = getCellString(row.getCell(4));
                String diaChi = getCellString(row.getCell(5));
                String tenKhoa = getCellString(row.getCell(6));

                if (hoTen == null || hoTen.isEmpty()) continue;
                if (tenKhoa == null || tenKhoa.isEmpty()) throw new RuntimeException("Dòng " + (row.getRowNum() + 1) + ": Thiếu tên khoa");

                Khoa khoa = khoaPort.timTheoTen(tenKhoa.trim()).orElseThrow(() -> new RuntimeException("Không tìm thấy khoa: " + tenKhoa));
                if (email != null && !email.isEmpty() && giaoVienPort.existsByEmail(email.trim())) continue;
                if (soDienThoai != null && !soDienThoai.isEmpty() && giaoVienPort.existsBySoDienThoai(soDienThoai.trim())) continue;

                list.add(GiaoVien.builder()
                        .hoTen(hoTen.trim()).namSinh(namSinh).trinhDo(trinhDo)
                        .soDienThoai(soDienThoai).email(email).diaChi(diaChi).khoa(khoa)
                        .build());
            }
            giaoVienPort.luuDanhSach(list);
        } catch (Exception e) {
            throw new RuntimeException("Lỗi đọc file Excel Giáo Viên: " + e.getMessage());
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