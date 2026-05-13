package com.nckh.htql_thi.application.service;

import com.nckh.htql_thi.application.dto.ThongKeLopHocDTO;
import com.nckh.htql_thi.application.port.in.ManageDiemThiUseCase;
import com.nckh.htql_thi.application.port.out.*;
import com.nckh.htql_thi.domain.entity.*;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.List;

@Service
public class DiemThiService implements ManageDiemThiUseCase {

    private final DiemThiPort diemThiPort;
    private final SinhVienPort sinhVienPort;
    private final LopHocPort lopHocPort;

    public DiemThiService(DiemThiPort diemThiPort, SinhVienPort sinhVienPort, LopHocPort lopHocPort) {
        this.diemThiPort = diemThiPort;
        this.sinhVienPort = sinhVienPort;
        this.lopHocPort = lopHocPort;
    }

    @Override
    @Transactional
    public void importDiemAExcel(Long maLopHoc, InputStream inputStream) {
        DataFormatter formatter = new DataFormatter(); 
        try (Workbook workbook = new XSSFWorkbook(inputStream)) {
            Sheet sheet = workbook.getSheetAt(0);
            List<LopHoc> allLopHocs = lopHocPort.layTatCa();

            for (Row row : sheet) {
                if (row.getRowNum() == 0) continue; 

                // Sử dụng formatter và trim() để tránh lỗi khoảng trắng
                String msvStr = formatter.formatCellValue(row.getCell(1)).trim();
                String maMonStr = formatter.formatCellValue(row.getCell(3)).trim();
                String diemAStr = formatter.formatCellValue(row.getCell(5)).trim();

                // Bỏ qua nếu dòng trống
                if (msvStr.isEmpty() || maMonStr.isEmpty() || diemAStr.isEmpty()) continue;

                Long msv = Long.parseLong(msvStr);
                Long maMon = Long.parseLong(maMonStr);
                // Xử lý cả trường hợp điểm Excel nhập dấu phẩy (VD: 8,5 -> 8.5)
                Double diemA = Double.parseDouble(diemAStr.replace(",", "."));

                SinhVien sv = sinhVienPort.timTheoId(msv)
                        .orElseThrow(() -> new RuntimeException("Dòng " + (row.getRowNum() + 1) + ": Không tìm thấy Sinh Viên có MSV: " + msv));

                LopHoc lopHoc = allLopHocs.stream()
                        .filter(lh -> lh.getMonHoc().getMaMonHoc().equals(maMon))
                        .filter(lh -> lh.getDsSinhVien().stream().anyMatch(s -> s.getMsv().equals(msv)))
                        .findFirst()
                        .orElseThrow(() -> new RuntimeException("Dòng " + (row.getRowNum() + 1) + ": Sinh viên " + sv.getHoTen() + " không có danh sách thi môn " + maMon));

                DiemThi diemThi = diemThiPort.findBySinhVienAndLopHoc(msv, lopHoc.getMaLopHoc())
                        .orElse(DiemThi.builder().sinhVien(sv).lopHoc(lopHoc).build());
                        
                diemThi.setDiemA(diemA);
                diemThi.tinhDiem(); 
                diemThiPort.luu(diemThi);
            }
        } catch (Exception e) {
            throw new RuntimeException("Lỗi đọc file điểm A: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public void importDiemTuExcel(MultipartFile file) {
        try {
            // Tái sử dụng code từ hàm importDiemAExcel để code gọn hơn
            importDiemAExcel(null, file.getInputStream());
        } catch (Exception e) {
            throw new RuntimeException("Lỗi đọc luồng file: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public void importDiemThanhPhanExcel(MultipartFile file) {
        DataFormatter formatter = new DataFormatter();
        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            List<LopHoc> allLopHocs = lopHocPort.layTatCa();

            for (Row row : sheet) {
                if (row.getRowNum() == 0) continue; 

                String msvStr = formatter.formatCellValue(row.getCell(1)).trim();
                String maMonStr = formatter.formatCellValue(row.getCell(3)).trim();
                
                if (msvStr.isEmpty() || maMonStr.isEmpty()) continue;

                Long msv = Long.parseLong(msvStr);
                Long maMon = Long.parseLong(maMonStr);

                SinhVien sv = sinhVienPort.timTheoId(msv)
                        .orElseThrow(() -> new RuntimeException("Dòng " + (row.getRowNum() + 1) + ": Không tìm thấy Sinh Viên MSV: " + msv));

                LopHoc lopHoc = allLopHocs.stream()
                        .filter(lh -> lh.getMonHoc().getMaMonHoc().equals(maMon))
                        .filter(lh -> lh.getDsSinhVien().stream().anyMatch(s -> s.getMsv().equals(msv)))
                        .findFirst()
                        .orElseThrow(() -> new RuntimeException("Dòng " + (row.getRowNum() + 1) + ": Sinh viên " + sv.getHoTen() + " chưa được xếp vào lớp môn " + maMon));

                DiemThi diemThi = diemThiPort.findBySinhVienAndLopHoc(msv, lopHoc.getMaLopHoc())
                        .orElse(DiemThi.builder().sinhVien(sv).lopHoc(lopHoc).build());

                String diemBStr = formatter.formatCellValue(row.getCell(5)).trim();
                String diemCStr = formatter.formatCellValue(row.getCell(6)).trim();

                // Dùng replace(",", ".") để tránh lỗi format điểm
                if (!diemBStr.isEmpty()) diemThi.setDiemB(Double.parseDouble(diemBStr.replace(",", ".")));
                if (!diemCStr.isEmpty()) diemThi.setDiemC(Double.parseDouble(diemCStr.replace(",", ".")));

                diemThi.tinhDiem(); 
                diemThiPort.luu(diemThi);
            }
        } catch (Exception e) {
            throw new RuntimeException("Lỗi import điểm thành phần (B, C): " + e.getMessage());
        }
    }

    @Override
    public ThongKeLopHocDTO thongKeTheoLop(Long maLopHoc) {
        LopHoc lopHoc = lopHocPort.timTheoId(maLopHoc).orElseThrow(() -> new RuntimeException("Không tìm thấy lớp học"));
        List<DiemThi> dsDiem = diemThiPort.findByLopHoc(maLopHoc);
        
        int total = dsDiem.size();
        if (total == 0) {
            return ThongKeLopHocDTO.builder()
                    .maLopHoc(maLopHoc)
                    .tenMonHoc(lopHoc.getMonHoc().getTenMonHoc())
                    .tongSoSinhVien(0)
                    .build();
        }

        int passCount = 0;
        int aP=0, a=0, bP=0, b=0, cP=0, c=0, dP=0, d=0, f=0;

        for (DiemThi dt : dsDiem) {
            if (dt.getDiemTb() != null) {
                if (dt.getDiemTb() >= 4.0) passCount++;
                if (dt.getDiemChu() != null) {
                    switch (dt.getDiemChu()) {
                        case "A+": aP++; break; case "A": a++; break;
                        case "B+": bP++; break; case "B": b++; break;
                        case "C+": cP++; break; case "C": c++; break;
                        case "D+": dP++; break; case "D": d++; break;
                        case "F": f++; break;
                    }
                }
            }
        }

        return ThongKeLopHocDTO.builder()
                .maLopHoc(maLopHoc).tenMonHoc(lopHoc.getMonHoc().getTenMonHoc())
                .tenGiaoVien(lopHoc.getGiaoVien() != null ? lopHoc.getGiaoVien().getHoTen() : "Không có")
                .tongSoSinhVien(total)
                .soLuongDat(passCount).soLuongTruot(total - passCount)
                .tiLeDat(Math.round(((double) passCount / total) * 10000.0) / 100.0)
                .diemA_Plus(aP).diemA(a).diemB_Plus(bP).diemB(b).diemC_Plus(cP).diemC(c).diemD_Plus(dP).diemD(d).diemF(f)
                .build();
    }
}