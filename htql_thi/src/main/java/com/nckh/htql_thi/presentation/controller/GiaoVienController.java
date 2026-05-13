package com.nckh.htql_thi.presentation.controller;

import com.nckh.htql_thi.application.port.in.ManageGiaoVienUseCase;
import com.nckh.htql_thi.domain.entity.GiaoVien;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@RestController
@RequestMapping("/api/giao-vien")
@RequiredArgsConstructor
public class GiaoVienController {

    private final ManageGiaoVienUseCase giaoVienUseCase;

    @GetMapping
    public ResponseEntity<List<GiaoVien>> getAll() { 
        return ResponseEntity.ok(giaoVienUseCase.getAllGiaoVien());
    }

    @GetMapping("/{id}")
    public ResponseEntity<GiaoVien> getById(@PathVariable Long id) { 
        return ResponseEntity.ok(giaoVienUseCase.getGiaoVienById(id));
    }

    @PostMapping
    public ResponseEntity<GiaoVien> create(@RequestBody GiaoVien giaoVien) { 
        return ResponseEntity.ok(giaoVienUseCase.createGiaoVien(giaoVien));
    }

    @PutMapping("/{id}")
    public ResponseEntity<GiaoVien> update(@PathVariable Long id, @RequestBody GiaoVien giaoVien) { 
        return ResponseEntity.ok(giaoVienUseCase.updateGiaoVien(id, giaoVien));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        giaoVienUseCase.deleteGiaoVien(id);
        return ResponseEntity.ok("Xóa giáo viên thành công");
    }

    @PostMapping("/import-excel")
    public ResponseEntity<String> importExcel(@RequestParam("file") MultipartFile file) {
        try {
            giaoVienUseCase.importExcel(file.getInputStream());
            return ResponseEntity.ok("Import Excel Giáo Viên thành công");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Import Excel thất bại: " + e.getMessage());
        }
    }
}