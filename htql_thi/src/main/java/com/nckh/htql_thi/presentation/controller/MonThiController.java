package com.nckh.htql_thi.presentation.controller;

import com.nckh.htql_thi.application.port.in.ManageMonThiUseCase;
import com.nckh.htql_thi.domain.entity.MonThi;
import com.nckh.htql_thi.domain.entity.SinhVien;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/mon-thi")
@RequiredArgsConstructor
public class MonThiController {

    private final ManageMonThiUseCase monThiUseCase;

    @GetMapping
    public ResponseEntity<List<MonThi>> getAll() {
        return ResponseEntity.ok(monThiUseCase.getAllMonThi());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MonThi> getById(@PathVariable Long id) {
        return ResponseEntity.ok(monThiUseCase.getMonThiById(id));
    }

    @GetMapping("/ki-thi/{maKiThi}")
    public ResponseEntity<List<MonThi>> getByKiThi(@PathVariable Long maKiThi) {
        return ResponseEntity.ok(monThiUseCase.getMonThiByKiThi(maKiThi));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MonThi> update(@PathVariable Long id,
                                        @RequestBody UpdateMonThiRequest request) {
        return ResponseEntity.ok(monThiUseCase.updateMonThi(
                id,
                request.getHinhThucThi(),
                request.getPhongThi(),
                request.getThoiGianThi(),
                request.getDsMaGiamThi()
        ));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        monThiUseCase.deleteMonThi(id);
        return ResponseEntity.ok("Xóa môn thi thành công");
    }
    @GetMapping("/{maMonThi}/sinh-vien")
    public ResponseEntity<List<SinhVien>> getSinhVienByMonThi(
        @PathVariable Long maMonThi
    ){
        return ResponseEntity.ok(
            monThiUseCase.getSinhVienByMonThi(maMonThi)
        );
    }


    @Data
    public static class UpdateMonThiRequest {
        private String hinhThucThi;
        private String phongThi;
        private LocalDateTime thoiGianThi;
        private List<Long> dsMaGiamThi;
    }
}