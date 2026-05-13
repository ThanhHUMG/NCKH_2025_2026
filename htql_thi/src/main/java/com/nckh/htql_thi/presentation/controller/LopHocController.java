package com.nckh.htql_thi.presentation.controller;

import com.nckh.htql_thi.application.port.in.ManageLopHocUseCase;
import com.nckh.htql_thi.domain.entity.LopHoc;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@RestController
@RequestMapping("/api/lop-hoc")
@RequiredArgsConstructor
public class LopHocController {

    private final ManageLopHocUseCase lopHocUseCase;

    @GetMapping
    public ResponseEntity<List<LopHoc>> getAll() {
        return ResponseEntity.ok(lopHocUseCase.getAllLopHoc());
    }

    @GetMapping("/{id}")
    public ResponseEntity<LopHoc> getById(@PathVariable Long id) {
        return ResponseEntity.ok(lopHocUseCase.getLopHocById(id));
    }

    @PostMapping
    public ResponseEntity<LopHoc> create(@RequestBody LopHoc lopHocReq) {
        return ResponseEntity.ok(lopHocUseCase.createLopHoc(lopHocReq));
    }

    @PutMapping("/{id}")
    public ResponseEntity<LopHoc> update(@PathVariable Long id, @RequestBody LopHoc lopHocReq) {
        return ResponseEntity.ok(lopHocUseCase.updateLopHoc(id, lopHocReq));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        lopHocUseCase.deleteLopHoc(id);
        return ResponseEntity.ok("Xóa lớp học thành công");
    }

    @PostMapping("/{id}/import-sinh-vien")
    public ResponseEntity<String> importSinhVien(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        try {
            lopHocUseCase.importSinhVienExcel(id, file.getInputStream());
            return ResponseEntity.ok("Import thành công");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }
}