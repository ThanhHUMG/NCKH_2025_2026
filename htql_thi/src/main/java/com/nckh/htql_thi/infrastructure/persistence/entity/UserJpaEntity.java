package com.nckh.htql_thi.infrastructure.persistence.entity;

import com.nckh.htql_thi.domain.enums.Role;
import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name = "users")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class UserJpaEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;
    
    @Enumerated(EnumType.STRING) @Column(nullable = false)
    private Role role;

    @OneToOne(fetch = FetchType.EAGER) @JoinColumn(name = "sinh_vien_id")
    private SinhVienJpaEntity sinhVien;

    @OneToOne(fetch = FetchType.EAGER) @JoinColumn(name = "giao_vien_id")
    private GiaoVienJpaEntity giaoVien;
}