package com.nckh.htql_thi.presentation.controller;

import com.nckh.htql_thi.application.port.in.ManageTeacherUseCase;
import com.nckh.htql_thi.domain.entity.*;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/teacher")
@RequiredArgsConstructor
public class TeacherController {
    private final ManageTeacherUseCase teacherUseCase;

    @GetMapping("/me")
    public ResponseEntity<GiaoVien> getMyInfo(Authentication auth) {
        return ResponseEntity.ok(teacherUseCase.getMyInfo(auth.getName()));
    }

    @GetMapping("/lop-hoc")
    public ResponseEntity<List<LopHoc>> getMyLopHoc(Authentication auth) {
        return ResponseEntity.ok(teacherUseCase.getMyLopHoc(auth.getName()));
    }

    @GetMapping("/lich-thi")
    public ResponseEntity<List<LichThi>> getMyLichThi(Authentication auth) {
        return ResponseEntity.ok(teacherUseCase.getMyLichThi(auth.getName()));
    }

    @PostMapping("/lop-hoc/{maLopHoc}/nhap-diem-bc")
    public ResponseEntity<DiemThi> nhapDiemBC(Authentication auth, @PathVariable Long maLopHoc, @RequestBody NhapDiemBCRequest request) {
        return ResponseEntity.ok(teacherUseCase.nhapDiemBC(auth.getName(), maLopHoc, request.getMsv(), request.getDiemB(), request.getDiemC()));
    }

    @Data public static class NhapDiemBCRequest { private Long msv; private Double diemB; private Double diemC; }
}