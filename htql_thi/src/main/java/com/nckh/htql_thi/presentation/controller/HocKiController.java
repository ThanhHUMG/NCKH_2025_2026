package com.nckh.htql_thi.presentation.controller;

import com.nckh.htql_thi.application.port.in.ManageHocKiUseCase;
import com.nckh.htql_thi.domain.entity.HocKi;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@RestController
@RequestMapping("/api/hoc-ky")
@RequiredArgsConstructor
public class HocKiController {

    private final ManageHocKiUseCase hocKiUseCase;

    @GetMapping
    public ResponseEntity<List<HocKi>> getAll() { 
        return ResponseEntity.ok(hocKiUseCase.getAllHocKi()); 
    }

    @GetMapping("/{id}")
    public ResponseEntity<HocKi> getById(@PathVariable Long id) { 
        return ResponseEntity.ok(hocKiUseCase.getHocKiById(id)); 
    }

    @PostMapping
    public ResponseEntity<HocKi> create(@RequestBody HocKi hocKi) { 
        return ResponseEntity.ok(hocKiUseCase.createHocKi(hocKi)); 
    }

    @PutMapping("/{id}")
    public ResponseEntity<HocKi> update(@PathVariable Long id, @RequestBody HocKi hocKi) { 
        return ResponseEntity.ok(hocKiUseCase.updateHocKi(id, hocKi)); 
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        hocKiUseCase.deleteHocKi(id);
        return ResponseEntity.ok("Xóa học kỳ thành công");
    }

    @PostMapping("/import-excel")
    public ResponseEntity<String> importExcel(@RequestParam("file") MultipartFile file) {
        try {
            hocKiUseCase.importExcel(file.getInputStream());
            return ResponseEntity.ok("Import Excel Học Kỳ thành công");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Import Excel thất bại: " + e.getMessage());
        }
    }
}