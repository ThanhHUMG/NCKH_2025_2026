package com.nckh.htql_thi.presentation.controller;

import com.nckh.htql_thi.application.port.in.ManageTeacherUseCase;
import com.nckh.htql_thi.domain.entity.DiemThi;
import com.nckh.htql_thi.domain.entity.MonThi;
import com.nckh.htql_thi.domain.entity.LopHoc;
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

    @GetMapping("/mon-thi")
    public ResponseEntity<List<MonThi>> getMyMonThi(Authentication authentication) {
        return ResponseEntity.ok(teacherUseCase.getMyMonThi(authentication.getName()));
    }

    @GetMapping("/mon-thi/{maMonThi}/scores")
    public ResponseEntity<List<DiemThi>> getScores(Authentication authentication,
                                                   @PathVariable Long maMonThi) {
        return ResponseEntity.ok(teacherUseCase.getScoresOfMonThi(authentication.getName(), maMonThi));
    }

    @PostMapping("/mon-thi/{maMonThi}/nhap-diem")
    public ResponseEntity<DiemThi> nhapDiem(Authentication authentication,
                                            @PathVariable Long maMonThi,
            @RequestBody NhapDiemRequest request) {

        return ResponseEntity.ok(
                teacherUseCase.nhapDiem(authentication.getName(),
                        maMonThi,
                        request.getMsv(),
                        request.getDiemA(),
                        request.getDiemB(),
                        request.getDiemC()));
    }
    @GetMapping("/lop-hoc")
    public ResponseEntity<List<LopHoc>> getMyLopHoc(Authentication authentication) {
        return ResponseEntity.ok(teacherUseCase.getMyLopHoc(authentication.getName()));
    }

    @Data
    public static class NhapDiemRequest {
        private Long msv;
        private Double diemA;
        private Double diemB;
        private Double diemC;
    }
}