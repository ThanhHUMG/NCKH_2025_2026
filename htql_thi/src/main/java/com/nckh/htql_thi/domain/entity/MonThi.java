package com.nckh.htql_thi.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "mon_thi")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MonThi {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long maMonThi;

    @Column(nullable = false)
    private String tenMonThi;

    private String hinhThucThi;
    private String phongThi;

    private LocalDateTime thoiGianThi;

    @ManyToOne
    @JoinColumn(name = "ma_lop_hoc")
    private LopHoc lopHoc;

    @ManyToOne
    @JoinColumn(name = "ma_ki_thi")
    private KiThi kiThi;

    @ManyToMany
    @JoinTable(
            name = "mon_thi_giam_thi",
            joinColumns = @JoinColumn(name = "ma_mon_thi"),
            inverseJoinColumns = @JoinColumn(name = "ma_giao_vien")
    )
    private List<GiaoVien> dsGiamThi;

    @JsonIgnore
    @OneToMany(mappedBy = "monThi", cascade = CascadeType.ALL)
    private List<DiemThi> dsDiemThi;
}