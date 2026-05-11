package com.nckh.htql_thi.presentation.controller;

import com.nckh.htql_thi.application.port.in.ManageKiThiUseCase;
import com.nckh.htql_thi.domain.entity.KiThi;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/ki-thi")
@RequiredArgsConstructor
public class KiThiController {
    private final ManageKiThiUseCase kiThiUseCase;

    @GetMapping
    public ResponseEntity<List<KiThi>> getAll() { return ResponseEntity.ok(kiThiUseCase.getAllKiThi()); }

    @GetMapping("/{id}")
    public ResponseEntity<KiThi> getById(@PathVariable Long id) { return ResponseEntity.ok(kiThiUseCase.getKiThiById(id)); }

    @PostMapping
    public ResponseEntity<KiThi> create(@RequestBody CreateKiThiRequest request) {
        return ResponseEntity.ok(kiThiUseCase.createKiThi(request.getTenKiThi(), request.getMaHocKi()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        kiThiUseCase.deleteKiThi(id);
        return ResponseEntity.ok("Xóa kỳ thi thành công");
    }

    @Data public static class CreateKiThiRequest { private String tenKiThi; private Long maHocKi; }
}