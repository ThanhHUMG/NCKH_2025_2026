package com.nckh.htql_thi.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name = "diem_thi", uniqueConstraints = @UniqueConstraint(columnNames = {"msv", "ma_lop_hoc"}))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DiemThiJpaEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "msv")
    private SinhVienJpaEntity sinhVien;
    
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "ma_lop_hoc")
    private LopHocJpaEntity lopHoc;
    
    private Double diemA;
    private Double diemB;
    private Double diemC;
    private Double diemTb;
    private String diemChu;
}