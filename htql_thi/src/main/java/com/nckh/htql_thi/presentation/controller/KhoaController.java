package com.nckh.htql_thi.presentation.controller;

import com.nckh.htql_thi.application.port.in.ManageKhoaUseCase;
import com.nckh.htql_thi.domain.entity.Khoa;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/khoa")
@RequiredArgsConstructor
public class KhoaController {

    private final ManageKhoaUseCase khoaUseCase;

    @GetMapping
    public ResponseEntity<List<Khoa>> getAll() {
        return ResponseEntity.ok(khoaUseCase.getAllKhoa());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Khoa> getById(@PathVariable Long id) {
        return ResponseEntity.ok(khoaUseCase.getKhoaById(id));
    }

    @PostMapping
    public ResponseEntity<Khoa> create(@RequestBody Khoa khoa) {
        return ResponseEntity.ok(khoaUseCase.createKhoa(khoa));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Khoa> update(@PathVariable Long id, @RequestBody Khoa khoa) {
        return ResponseEntity.ok(khoaUseCase.updateKhoa(id, khoa));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        khoaUseCase.deleteKhoa(id);
        return ResponseEntity.ok("Xóa khoa thành công");
    }

    @PostMapping("/import-excel")
    public ResponseEntity<String> importExcel(@RequestParam("file") MultipartFile file) {
        try {
            khoaUseCase.importExcel(file.getInputStream());
            return ResponseEntity.ok("Import Excel Khoa thành công");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Import Excel thất bại: " + e.getMessage());
        }
    }
}