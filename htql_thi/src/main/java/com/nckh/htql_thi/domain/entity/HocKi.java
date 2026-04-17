package com.nckh.htql_thi.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "hoc_ky")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HocKi {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long maHocKi;

    @Column(nullable = false)
    private String tenHocKy;

    // 1 học kỳ có nhiều lớp
    @JsonIgnore
    @OneToMany(mappedBy = "hocKi")
    private List<LopHoc> dsLopHoc;
}