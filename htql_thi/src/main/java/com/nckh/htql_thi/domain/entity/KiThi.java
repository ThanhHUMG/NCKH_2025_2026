package com.nckh.htql_thi.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "ki_thi")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KiThi {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long maKiThi;

    @Column(nullable = false)
    private String tenKiThi;

    @ManyToOne
    @JoinColumn(name = "ma_hoc_ky")
    private HocKi hocKi;

    @JsonIgnore
    @OneToMany(mappedBy = "kiThi", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MonThi> dsMonThi = new ArrayList<>();
}