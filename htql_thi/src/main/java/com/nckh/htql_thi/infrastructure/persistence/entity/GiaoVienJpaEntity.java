package com.nckh.htql_thi.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name = "giao_vien")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class GiaoVienJpaEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long maGiaoVien;
    @Column(nullable = false)
    private String hoTen;
    private Integer namSinh;
    private String trinhDo;
    @Column(unique = true)
    private String soDienThoai;
    @Column(unique = true)
    private String email;
    private String diaChi;
    @ManyToOne @JoinColumn(name = "ma_khoa")
    private KhoaJpaEntity khoa;
}