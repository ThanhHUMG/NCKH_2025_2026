package com.nckh.htql_thi.presentation.controller;

import com.nckh.htql_thi.application.port.in.ManageDiemThiUseCase;
import com.nckh.htql_thi.domain.entity.DiemThi;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/diem-thi")
@RequiredArgsConstructor
public class DiemThiController {

    private final ManageDiemThiUseCase diemThiUseCase;

    @GetMapping
    public ResponseEntity<List<DiemThi>> getAll() {
        return ResponseEntity.ok(diemThiUseCase.getAllDiemThi());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DiemThi> getById(@PathVariable Long id) {
        return ResponseEntity.ok(diemThiUseCase.getDiemThiById(id));
    }

    @PostMapping("/mon-thi/{maMonThi}/nhap-diem")
    public ResponseEntity<DiemThi> nhapDiem(
            @PathVariable Long maMonThi,
            @RequestBody NhapDiemRequest request
    ) {
        return ResponseEntity.ok(
                diemThiUseCase.nhapDiem(
                        request.getMsv(),
                        maMonThi,
                        request.getDiemA(),
                        request.getDiemB(),
                        request.getDiemC()
                )
        );
    }

    @GetMapping("/mon-thi/{maMonThi}")
    public ResponseEntity<List<DiemThi>> getByMonThi(@PathVariable Long maMonThi) {
        return ResponseEntity.ok(diemThiUseCase.getDiemByMonThi(maMonThi));
    }

    @GetMapping("/sinh-vien/{msv}")
    public ResponseEntity<List<DiemThi>> getBySinhVien(@PathVariable Long msv) {
        return ResponseEntity.ok(diemThiUseCase.getDiemBySinhVien(msv));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        diemThiUseCase.deleteDiemThi(id);
        return ResponseEntity.ok("Xóa điểm thi thành công");
    }

    @Data
    public static class NhapDiemRequest {
        private Long msv;
        private Double diemA;
        private Double diemB;
        private Double diemC;
    }
}