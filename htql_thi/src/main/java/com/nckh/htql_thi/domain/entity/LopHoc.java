package com.nckh.htql_thi.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "lop_hoc")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LopHoc {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long maLopHoc;

    @ManyToOne
    @JoinColumn(name = "ma_mon_hoc")
    private MonHoc monHoc;

    @ManyToOne
    @JoinColumn(name = "ma_giao_vien")
    private GiaoVien giaoVien;

    @ManyToOne
    @JoinColumn(name = "ma_hoc_ky")
    private HocKi hocKi;

    @ManyToMany
    @JoinTable(
            name = "lop_hoc_sinh_vien",
            joinColumns = @JoinColumn(name = "ma_lop_hoc"),
            inverseJoinColumns = @JoinColumn(name = "msv")
    )
    private List<SinhVien> dsSinhVien = new ArrayList<>();

    @JsonIgnore
    @OneToOne(mappedBy = "lopHoc", cascade = CascadeType.ALL)
    private MonThi monThi;
}