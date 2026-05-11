package com.nckh.htql_thi.presentation.controller;

import com.nckh.htql_thi.application.port.in.ManageLichThiUseCase;
import com.nckh.htql_thi.domain.entity.LichThi;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@RestController
@RequestMapping("/api/lich-thi")
@RequiredArgsConstructor
public class LichThiController {
    private final ManageLichThiUseCase lichThiUseCase;

    @GetMapping
    public ResponseEntity<List<LichThi>> getAll() { return ResponseEntity.ok(lichThiUseCase.getAllLichThi()); }

    @GetMapping("/{id}")
    public ResponseEntity<LichThi> getById(@PathVariable Long id) { return ResponseEntity.ok(lichThiUseCase.getLichThiById(id)); }

    @GetMapping("/ki-thi/{maKiThi}")
    public ResponseEntity<List<LichThi>> getByKiThi(@PathVariable Long maKiThi) { return ResponseEntity.ok(lichThiUseCase.getLichThiByKiThi(maKiThi)); }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        lichThiUseCase.deleteLichThi(id);
        return ResponseEntity.ok("Xóa lịch thi thành công");
    }

    @PostMapping("/ki-thi/{maKiThi}/import")
    public ResponseEntity<String> importLichThi(@PathVariable Long maKiThi, @RequestParam("file") MultipartFile file) {
        try {
            lichThiUseCase.importExcelLichThi(maKiThi, file.getInputStream());
            return ResponseEntity.ok("Import lịch thi và phân phòng thành công");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }
    @PutMapping("/{id}/phan-cong-coi-thi")
    public ResponseEntity<String> phanCongCoiThi(@PathVariable Long id, @RequestParam Long maGiaoVien) {
        try {
            lichThiUseCase.phanCongCoiThi(id, maGiaoVien);
            return ResponseEntity.ok("Phân công giáo viên coi thi thành công!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi phân công: " + e.getMessage());
        }
    }
}