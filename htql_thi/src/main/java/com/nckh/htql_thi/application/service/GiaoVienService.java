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
        // 1. Kiểm tra Mã GV không được để trống
        if (giaoVien.getMaGiaoVien() == null) {
            throw new RuntimeException("Mã giáo viên không được để trống!");
        }

        // 2. Kiểm tra trùng Mã GV trong hệ thống nhà trường
        if (giaoVienPort.timTheoId(giaoVien.getMaGiaoVien()).isPresent()) {
            throw new RuntimeException("Mã giáo viên " + giaoVien.getMaGiaoVien() + " đã tồn tại!");
        }

        if (giaoVien.getHoTen() == null || giaoVien.getHoTen().trim().isEmpty()) throw new RuntimeException("Họ tên không được để trống");
        if (giaoVien.getKhoa() == null || giaoVien.getKhoa().getMaKhoa() == null) throw new RuntimeException("Giáo viên phải thuộc khoa");
        
        // Lấy lại đúng entity Khoa từ DB để đảm bảo tính toàn vẹn
        Khoa khoa = khoaPort.timTheoId(giaoVien.getKhoa().getMaKhoa())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khoa"));
        giaoVien.setKhoa(khoa);
        
        giaoVien.setHoTen(giaoVien.getHoTen().trim());
        return giaoVienPort.luu(giaoVien);
    }

    @Override
    public GiaoVien updateGiaoVien(Long id, GiaoVien details) {
        GiaoVien gv = getGiaoVienById(id);
        if (details.getHoTen() == null || details.getHoTen().trim().isEmpty()) throw new RuntimeException("Họ tên không được để trống");

        // Cập nhật Khoa
        if (details.getKhoa() != null && details.getKhoa().getMaKhoa() != null) {
            Khoa khoa = khoaPort.timTheoId(details.getKhoa().getMaKhoa())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy khoa"));
            gv.setKhoa(khoa);
        }

        gv.setHoTen(details.getHoTen().trim());
        gv.setNamSinh(details.getNamSinh());
        gv.setTrinhDo(details.getTrinhDo());
        gv.setSoDienThoai(details.getSoDienThoai());
        gv.setEmail(details.getEmail());
        gv.setDiaChi(details.getDiaChi());
        
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
                if (row.getRowNum() == 0) continue; // Bỏ qua dòng tiêu đề

                // Dịch chuyển cột: Cột 0 bây giờ là Mã Giáo Viên
                String maGvStr = getCellString(row.getCell(0)); 
                String hoTen = getCellString(row.getCell(1));
                Integer namSinh = getCellInteger(row.getCell(2));
                String trinhDo = getCellString(row.getCell(3));
                String soDienThoai = getCellString(row.getCell(4));
                String email = getCellString(row.getCell(5));
                String diaChi = getCellString(row.getCell(6));
                String tenKhoa = getCellString(row.getCell(7)); // Dịch lên cột 7

                if (maGvStr == null || maGvStr.isEmpty() || hoTen == null || hoTen.isEmpty()) continue;
                
                Long maGv = Long.parseLong(maGvStr);

                if (tenKhoa == null || tenKhoa.isEmpty()) throw new RuntimeException("Dòng " + (row.getRowNum() + 1) + ": Thiếu tên khoa");

                Khoa khoa = khoaPort.timTheoTen(tenKhoa.trim()).orElseThrow(() -> new RuntimeException("Không tìm thấy khoa: " + tenKhoa));
                
                // Bỏ qua nếu mã GV đã tồn tại
                if (giaoVienPort.timTheoId(maGv).isPresent()) continue; 
                
                if (email != null && !email.isEmpty() && giaoVienPort.existsByEmail(email.trim())) continue;
                if (soDienThoai != null && !soDienThoai.isEmpty() && giaoVienPort.existsBySoDienThoai(soDienThoai.trim())) continue;

                list.add(GiaoVien.builder()
                        .maGiaoVien(maGv) // Đã nhét Mã GV vào đây
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