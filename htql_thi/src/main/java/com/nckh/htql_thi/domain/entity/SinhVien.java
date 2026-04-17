package com.nckh.htql_thi.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "sinh_vien")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SinhVien {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
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

    // sinh viên thuộc 1 khoa
    @ManyToOne
    @JoinColumn(name = "ma_khoa")
    private Khoa khoa;

    // sinh viên học nhiều lớp
    @JsonIgnore
    @ManyToMany(mappedBy = "dsSinhVien")
    private List<LopHoc> dsLopHoc;
}