package com.nckh.htql_thi.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name = "sinh_vien")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SinhVienJpaEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long msv;
    @Column(nullable = false)
    private String hoTen;
    private Integer namSinh;
    private String nienKhoa;
    @Column(unique = true)
    private String soDienThoai;
    @Column(unique = true)
    private String email;
    private String diaChi;
    @ManyToOne @JoinColumn(name = "ma_khoa")
    private KhoaJpaEntity khoa;
}