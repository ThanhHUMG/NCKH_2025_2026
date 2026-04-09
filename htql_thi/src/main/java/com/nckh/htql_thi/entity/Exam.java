package com.nckh.htql_thi.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class Exam {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String tenMonThi;
    private String maMonThi;
    private String ngayThi;
    private String gioThi;
    private String phongThi;
    private String kiThi;
    private String hinhThucThi;
}
