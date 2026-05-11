package com.nckh.htql_thi.domain.entity;

import com.nckh.htql_thi.domain.enums.Role;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    private Long id;
    private String username;
    private String password;
    private Role role;
    
    private SinhVien sinhVien;
    private GiaoVien giaoVien;
}