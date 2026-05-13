package com.nckh.htql_thi.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "lop_hoc")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LopHocJpaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long maLopHoc;

    private String nhom;
    private String phongHoc;
    private Integer tietBatDau;
    private String thoiGian;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_mon_hoc")
    private MonHocJpaEntity monHoc;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_giao_vien")
    private GiaoVienJpaEntity giaoVien;

    // SỬA DÒNG NÀY: Từ HocKyJpaEntity thành HocKiJpaEntity
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_hoc_ki")
    private HocKiJpaEntity hocKi; 

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "lop_hoc_sinh_vien",
        joinColumns = @JoinColumn(name = "ma_lop_hoc"),
        inverseJoinColumns = @JoinColumn(name = "msv")
    )
    private List<SinhVienJpaEntity> dsSinhVien;
}