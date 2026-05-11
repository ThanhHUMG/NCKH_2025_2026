package com.nckh.htql_thi.application.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ThongKeLopHocDTO {
    private Long maLopHoc;
    private String tenMonHoc;
    private String tenGiaoVien;
    private int tongSoSinhVien;
    private int soLuongDat;
    private int soLuongTruot;
    private double tiLeDat;
    private int diemA_Plus;
    private int diemA;
    private int diemB_Plus;
    private int diemB;
    private int diemC_Plus;
    private int diemC;
    private int diemD_Plus;
    private int diemD;
    private int diemF;
}