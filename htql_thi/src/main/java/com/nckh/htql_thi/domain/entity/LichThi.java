package com.nckh.htql_thi.domain.entity;

import lombok.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LichThi {
    private Long maLichThi;
    private KiThi kiThi;
    private MonHoc monHoc;
    
    private String phongThi;
    private LocalDate thoiGian;
    private Integer tietBatDau;
    private String hinhThucThi;
    private GiaoVien giaoVienCoiThi;

    @Builder.Default
    private List<SinhVien> dsSinhVien = new ArrayList<>();
    @Builder.Default
    private List<GiaoVien> dsGiamThi = new ArrayList<>();
}