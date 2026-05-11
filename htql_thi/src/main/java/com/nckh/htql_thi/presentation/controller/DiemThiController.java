package com.nckh.htql_thi.presentation.controller;

import com.nckh.htql_thi.application.dto.ThongKeLopHocDTO;
import com.nckh.htql_thi.application.port.in.ManageDiemThiUseCase;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/diem-thi")
@RequiredArgsConstructor
public class DiemThiController {
    private final ManageDiemThiUseCase diemThiUseCase;

    // API cũ để tương thích
    @PostMapping("/lop-hoc/{maLopHoc}/import-diem-a")
    public ResponseEntity<String> importDiemA(@PathVariable Long maLopHoc, @RequestParam("file") MultipartFile file) {
        try {
            diemThiUseCase.importDiemAExcel(maLopHoc, file.getInputStream());
            return ResponseEntity.ok("Import điểm A thành công!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi import: " + e.getMessage());
        }
    }

    @PostMapping("/import")
    public ResponseEntity<String> importDiemTuDong(@RequestParam("file") MultipartFile file) {
        try {
            diemThiUseCase.importDiemTuExcel(file);
            return ResponseEntity.ok("Hệ thống đã tự động lưu điểm cho các sinh viên thành công!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi import: " + e.getMessage());
        }
    }

    @GetMapping("/lop-hoc/{maLopHoc}/thong-ke")
    public ResponseEntity<ThongKeLopHocDTO> thongKeLopHoc(@PathVariable Long maLopHoc) {
        return ResponseEntity.ok(diemThiUseCase.thongKeTheoLop(maLopHoc));
    }
}