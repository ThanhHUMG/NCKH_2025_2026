package com.nckh.htql_thi.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name = "mon_hoc")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class MonHocJpaEntity {
    @Id
    private Long maMonHoc;
    @Column(nullable = false)
    private String tenMonHoc;
    private Integer tinChi;
    @ManyToOne @JoinColumn(name = "ma_khoa")
    private KhoaJpaEntity khoa;
}