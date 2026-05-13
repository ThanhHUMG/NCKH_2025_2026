package com.nckh.htql_thi.domain.entity;

import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LopHoc {
    private Long maLopHoc;
    private MonHoc monHoc;
    private GiaoVien giaoVien;
    private HocKi hocKi;
    private String nhom;
    private String phongHoc;
    private Integer tietBatDau;
    private String thoiGian;
    @Builder.Default
    private List<SinhVien> dsSinhVien = new ArrayList<>();
}