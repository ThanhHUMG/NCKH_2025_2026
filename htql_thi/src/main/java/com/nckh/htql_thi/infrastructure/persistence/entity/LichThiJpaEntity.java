package com.nckh.htql_thi.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity @Table(name = "lich_thi")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class LichThiJpaEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long maLichThi;
    
    @ManyToOne @JoinColumn(name = "ma_ki_thi")
    private KiThiJpaEntity kiThi;
    
    @ManyToOne @JoinColumn(name = "ma_mon_hoc")
    private MonHocJpaEntity monHoc;
    
    private String phongThi;
    private LocalDate thoiGian;
    private Integer tietBatDau;
    private String hinhThucThi;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "lich_thi_sinh_vien",
            joinColumns = @JoinColumn(name = "ma_lich_thi"),
            inverseJoinColumns = @JoinColumn(name = "msv"))
    @Builder.Default
    private List<SinhVienJpaEntity> dsSinhVien = new ArrayList<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "lich_thi_giam_thi",
            joinColumns = @JoinColumn(name = "ma_lich_thi"),
            inverseJoinColumns = @JoinColumn(name = "ma_giao_vien"))
    @Builder.Default
    private List<GiaoVienJpaEntity> dsGiamThi = new ArrayList<>();
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "giao_vien_coi_thi_id")
    private GiaoVienJpaEntity giaoVienCoiThi;
}