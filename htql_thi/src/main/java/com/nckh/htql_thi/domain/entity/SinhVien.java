package com.nckh.htql_thi.domain.entity;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SinhVien {
    private Long msv;
    private String hoTen;
    private Integer namSinh;
    private String nienKhoa;
    private String soDienThoai;
    private String email;
    private String diaChi;
    private Khoa khoa;
}