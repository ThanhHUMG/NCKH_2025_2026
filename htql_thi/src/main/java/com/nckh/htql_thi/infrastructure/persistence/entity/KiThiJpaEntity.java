package com.nckh.htql_thi.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name = "ki_thi")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class KiThiJpaEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long maKiThi;
    @Column(nullable = false)
    private String tenKiThi;
    @ManyToOne @JoinColumn(name = "ma_hoc_ky")
    private HocKiJpaEntity hocKi;
}