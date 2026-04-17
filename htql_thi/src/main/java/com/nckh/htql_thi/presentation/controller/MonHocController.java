package com.nckh.htql_thi.presentation.controller;

import com.nckh.htql_thi.application.port.in.ManageMonHocUseCase;
import com.nckh.htql_thi.domain.entity.MonHoc;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/mon-hoc")
@RequiredArgsConstructor
public class MonHocController {

    private final ManageMonHocUseCase monHocUseCase;

    @GetMapping
    public ResponseEntity<List<MonHoc>> getAll() {
        return ResponseEntity.ok(monHocUseCase.getAllMonHoc());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MonHoc> getById(@PathVariable Long id) {
        return ResponseEntity.ok(monHocUseCase.getMonHocById(id));
    }

    @PostMapping
    public ResponseEntity<MonHoc> create(@RequestBody MonHoc monHoc) {
        return ResponseEntity.ok(monHocUseCase.createMonHoc(monHoc));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MonHoc> update(@PathVariable Long id, @RequestBody MonHoc monHoc) {
        return ResponseEntity.ok(monHocUseCase.updateMonHoc(id, monHoc));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        monHocUseCase.deleteMonHoc(id);
        return ResponseEntity.ok("Xóa môn học thành công");
    }

    @PostMapping("/import-excel")
    public ResponseEntity<String> importExcel(@RequestParam("file") MultipartFile file) {
        try {
            monHocUseCase.importExcel(file.getInputStream());
            return ResponseEntity.ok("Import Excel Môn Học thành công");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Import Excel thất bại: " + e.getMessage());
        }
    }
}