package com.nckh.htql_thi.presentation.controller;

import com.nckh.htql_thi.application.port.in.ManageLopHocUseCase;
import com.nckh.htql_thi.domain.entity.LopHoc;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<LopHoc> create(
            @RequestParam Long maMonHoc,
            @RequestParam Long maGiaoVien,
            @RequestParam Long maHocKi
    ) {
        return ResponseEntity.ok(lopHocUseCase.createLopHoc(maMonHoc, maGiaoVien, maHocKi));
    }

    @PutMapping("/{id}")
    public ResponseEntity<LopHoc> update(
            @PathVariable Long id,
            @RequestParam Long maMonHoc,
            @RequestParam Long maGiaoVien,
            @RequestParam Long maHocKi
    ) {
        return ResponseEntity.ok(lopHocUseCase.updateLopHoc(id, maMonHoc, maGiaoVien, maHocKi));
    }

    @PostMapping("/{id}/add-sinh-vien")
    public ResponseEntity<LopHoc> addSinhVien(
            @PathVariable Long id,
            @RequestBody List<Long> dsMsv
    ) {
        return ResponseEntity.ok(lopHocUseCase.addSinhVienToLop(id, dsMsv));
    }

    @DeleteMapping("/{id}/remove-sinh-vien/{msv}")
    public ResponseEntity<LopHoc> removeSinhVien(
            @PathVariable Long id,
            @PathVariable Long msv
    ) {
        return ResponseEntity.ok(lopHocUseCase.removeSinhVienFromLop(id, msv));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        lopHocUseCase.deleteLopHoc(id);
        return ResponseEntity.ok("Xóa lớp học thành công");
    }
}