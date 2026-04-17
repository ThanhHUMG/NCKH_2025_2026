package com.nckh.htql_thi.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "khoa")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Khoa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long maKhoa;

    @Column(nullable = false, unique = true)
    private String tenKhoa;

    @JsonIgnore
    @OneToMany(mappedBy = "khoa", cascade = CascadeType.ALL)
    private List<MonHoc> dsMonHoc;

    @JsonIgnore
    @OneToMany(mappedBy = "khoa", cascade = CascadeType.ALL)
    private List<GiaoVien> dsGiaoVien;

    @JsonIgnore
    @OneToMany(mappedBy = "khoa", cascade = CascadeType.ALL)
    private List<SinhVien> dsSinhVien;
}