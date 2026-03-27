package com.nckh.htql_thi.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class Student {
    @Id
    private Long msv;
    
    private String hoTen;
    private String nganh;
    private String lop;
    private String sdt;
    private String email;
    private String diaChi;
}