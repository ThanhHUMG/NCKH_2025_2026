package com.nckh.htql_thi.dto.request.exam;

import lombok.Data;

@Data
public class ExamCreationRequest {
    private String tenMonThi;
    private String maMonThi;
    private String ngayThi;
    private String gioThi;
    private String phongThi;
    private String kiThi;
    private String hinhThucThi;
}
