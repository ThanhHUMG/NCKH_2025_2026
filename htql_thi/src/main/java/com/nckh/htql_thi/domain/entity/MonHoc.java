package com.nckh.htql_thi.domain.entity;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MonHoc {
    private Long maMonHoc;
    private String tenMonHoc;
    private Integer tinChi;
    private Khoa khoa;
}