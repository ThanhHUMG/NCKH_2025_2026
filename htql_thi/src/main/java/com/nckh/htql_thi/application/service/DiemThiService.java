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
        // Giữ lại nếu cần dùng phương thức cũ
    }

    // ĐÂY LÀ PHƯƠNG THỨC MỚI ĐƯỢC CẬP NHẬT
    @Override
    @Transactional
    public void importDiemTuExcel(MultipartFile file) {
        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            
            // Lấy tất cả lớp học ra một lần để tăng tốc độ dò tìm
            List<LopHoc> allLopHocs = lopHocPort.layTatCa();

            for (Row row : sheet) {
                if (row.getRowNum() == 0) continue; // Bỏ qua tiêu đề

                Cell cellMsv = row.getCell(1);   // Cột 1: MSV
                Cell cellMaMon = row.getCell(3); // Cột 3: Mã môn
                Cell cellDiem = row.getCell(5);  // Cột 5: Điểm Cuối Kỳ (A)

                if (cellMsv == null || cellMsv.getCellType() == CellType.BLANK) continue;

                Long msv = (long) cellMsv.getNumericCellValue();
                Long maMon = (long) cellMaMon.getNumericCellValue();
                Double diemA = cellDiem.getNumericCellValue();

                // 1. Lấy thông tin Sinh Viên
                SinhVien sv = sinhVienPort.timTheoId(msv)
                        .orElseThrow(() -> new RuntimeException("Không tìm thấy Sinh Viên có MSV: " + msv));

                // 2. Tự động dò tìm Lớp học (Phải chứa Sinh Viên này và khớp Mã Môn)
                LopHoc lopHoc = allLopHocs.stream()
                        .filter(lh -> lh.getMonHoc().getMaMonHoc().equals(maMon))
                        .filter(lh -> lh.getDsSinhVien().stream().anyMatch(s -> s.getMsv().equals(msv)))
                        .findFirst()
                        .orElseThrow(() -> new RuntimeException("Sinh viên " + sv.getHoTen() + " (" + msv + ") không có danh sách thi môn học mã " + maMon));

                // 3. Cập nhật hoặc tạo mới điểm thi
                DiemThi diemThi = diemThiPort.findBySinhVienAndLopHoc(msv, lopHoc.getMaLopHoc())
                        .orElse(DiemThi.builder().sinhVien(sv).lopHoc(lopHoc).build());
                        
                diemThi.setDiemA(diemA);
                diemThi.tinhDiem(); // Tính toán điểm TB và Điểm Chữ theo Domain Rule
                
                diemThiPort.luu(diemThi);
            }
        } catch (Exception e) {
            throw new RuntimeException("Lỗi đọc file Excel: " + e.getMessage());
        }
    }

    @Override
    public ThongKeLopHocDTO thongKeTheoLop(Long maLopHoc) {
        LopHoc lopHoc = lopHocPort.timTheoId(maLopHoc).orElseThrow(() -> new RuntimeException("Không tìm thấy lớp học"));
        List<DiemThi> dsDiem = diemThiPort.findByLopHoc(maLopHoc);
        
        int total = dsDiem.size();
        if (total == 0) return ThongKeLopHocDTO.builder().tongSoSinhVien(0).build();

        int passCount = 0;
        int aP=0, a=0, bP=0, b=0, cP=0, c=0, dP=0, d=0, f=0;

        for (DiemThi dt : dsDiem) {
            if (dt.getDiemTb() != null) {
                if (dt.getDiemTb() >= 4.0) passCount++;
                switch (dt.getDiemChu()) {
                    case "A+": aP++; break; case "A": a++; break;
                    case "B+": bP++; break; case "B": b++; break;
                    case "C+": cP++; break; case "C": c++; break;
                    case "D+": dP++; break; case "D": d++; break;
                    case "F": f++; break;
                }
            }
        }

        return ThongKeLopHocDTO.builder()
                .maLopHoc(maLopHoc).tenMonHoc(lopHoc.getMonHoc().getTenMonHoc())
                .tenGiaoVien(lopHoc.getGiaoVien().getHoTen()).tongSoSinhVien(total)
                .soLuongDat(passCount).soLuongTruot(total - passCount)
                .tiLeDat(Math.round(((double) passCount / total) * 10000.0) / 100.0)
                .diemA_Plus(aP).diemA(a).diemB_Plus(bP).diemB(b).diemC_Plus(cP).diemC(c).diemD_Plus(dP).diemD(d).diemF(f)
                .build();
    }
}