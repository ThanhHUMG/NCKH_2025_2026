package com.nckh.htql_thi.presentation.controller;

import com.nckh.htql_thi.application.port.in.ManageSinhVienUseCase;
import com.nckh.htql_thi.domain.entity.SinhVien;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@RestController
@RequestMapping("/api/sinh-vien")
@RequiredArgsConstructor
public class SinhVienController {

    private final ManageSinhVienUseCase sinhVienUseCase;

    @GetMapping
    public ResponseEntity<List<SinhVien>> getAll() { 
        return ResponseEntity.ok(sinhVienUseCase.getAllSinhVien()); 
    }

    @GetMapping("/{id}")
    public ResponseEntity<SinhVien> getById(@PathVariable Long id) { 
        return ResponseEntity.ok(sinhVienUseCase.getSinhVienById(id)); 
    }

    @PostMapping
    public ResponseEntity<SinhVien> create(@RequestBody SinhVien sinhVien) { 
        return ResponseEntity.ok(sinhVienUseCase.createSinhVien(sinhVien)); 
    }

    @PutMapping("/{id}")
    public ResponseEntity<SinhVien> update(@PathVariable Long id, @RequestBody SinhVien sinhVien) { 
        return ResponseEntity.ok(sinhVienUseCase.updateSinhVien(id, sinhVien)); 
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        sinhVienUseCase.deleteSinhVien(id);
        return ResponseEntity.ok("Xóa sinh viên thành công");
    }

    @PostMapping("/import-excel")
    public ResponseEntity<String> importExcel(@RequestParam("file") MultipartFile file) {
        try {
            sinhVienUseCase.importExcel(file.getInputStream());
            return ResponseEntity.ok("Import Excel Sinh Viên thành công");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Import Excel thất bại: " + e.getMessage());
        }
    }
}