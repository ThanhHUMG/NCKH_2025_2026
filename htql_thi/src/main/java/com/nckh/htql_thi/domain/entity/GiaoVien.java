package com.nckh.htql_thi.domain.entity;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GiaoVien {
    private Long maGiaoVien;
    private String hoTen;
    private Integer namSinh;
    private String trinhDo;
    private String soDienThoai;
    private String email;
    private String diaChi;
    private Khoa khoa;
}