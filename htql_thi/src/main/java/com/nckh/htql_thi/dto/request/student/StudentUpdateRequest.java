package com.nckh.htql_thi.dto.request.student;

import lombok.Data;

@Data
public class StudentUpdateRequest {
    private String hoTen;
    private String nganh;
    private String lop;
    private String sdt;
    private String email;
    private String diaChi;
}
