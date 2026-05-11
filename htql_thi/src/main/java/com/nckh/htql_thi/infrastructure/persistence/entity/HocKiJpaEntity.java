package com.nckh.htql_thi.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name = "hoc_ky")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class HocKiJpaEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long maHocKi;
    @Column(nullable = false)
    private String tenHocKy;
}