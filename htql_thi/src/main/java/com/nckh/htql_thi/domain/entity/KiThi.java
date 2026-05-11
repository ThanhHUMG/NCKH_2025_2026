package com.nckh.htql_thi.domain.entity;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KiThi {
    private Long maKiThi;
    private String tenKiThi;
    private HocKi hocKi;
}