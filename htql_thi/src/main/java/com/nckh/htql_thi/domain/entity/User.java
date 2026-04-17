package com.nckh.htql_thi.domain.entity;

import com.nckh.htql_thi.domain.enums.Role;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @OneToOne
    @JoinColumn(name = "sinh_vien_id")
    private SinhVien sinhVien;

    @OneToOne
    @JoinColumn(name = "giao_vien_id")
    private GiaoVien giaoVien;
}