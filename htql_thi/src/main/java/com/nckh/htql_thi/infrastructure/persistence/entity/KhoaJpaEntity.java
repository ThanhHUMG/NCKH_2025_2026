package com.nckh.htql_thi.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name = "khoa")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class KhoaJpaEntity {
    @Id
    private Long maKhoa;
    @Column(nullable = false, unique = true)
    private String tenKhoa;
}