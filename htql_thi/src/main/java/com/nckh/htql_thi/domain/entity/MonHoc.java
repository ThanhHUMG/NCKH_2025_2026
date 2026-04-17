package com.nckh.htql_thi.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "mon_hoc")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MonHoc {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long maMonHoc;

    @Column(nullable = false)
    private String tenMonHoc;

    private Integer tinChi;

    @ManyToOne
    @JoinColumn(name = "ma_khoa")
    private Khoa khoa;

    // 1 môn học có thể có nhiều lớp học
    @JsonIgnore
    @OneToMany(mappedBy = "monHoc")
    private List<LopHoc> dsLopHoc;
}