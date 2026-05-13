package com.nckh.htql_thi.infrastructure.persistence.mapper;

import com.nckh.htql_thi.domain.entity.*;
import com.nckh.htql_thi.infrastructure.persistence.entity.*;
import org.springframework.stereotype.Component;
import java.util.ArrayList;
import java.util.stream.Collectors;

@Component
public class ComplexMapper {

    private final CoreMapper coreMapper;

    public ComplexMapper(CoreMapper coreMapper) {
        this.coreMapper = coreMapper;
    }

    // --- Lop Hoc ---
    public LopHoc toDomain(LopHocJpaEntity entity) {
        if (entity == null) return null;
        return LopHoc.builder()
                .maLopHoc(entity.getMaLopHoc())
                .nhom(entity.getNhom())
                .phongHoc(entity.getPhongHoc())
                .tietBatDau(entity.getTietBatDau())
                .thoiGian(entity.getThoiGian())
                .monHoc(coreMapper.toDomain(entity.getMonHoc()))
                .giaoVien(coreMapper.toDomain(entity.getGiaoVien()))
                .hocKi(entity.getHocKi() != null ? HocKi.builder()
                        .maHocKi(entity.getHocKi().getMaHocKi())
                        .tenHocKy(entity.getHocKi().getTenHocKy()) 
                        .build() : null)
                .dsSinhVien(entity.getDsSinhVien() != null 
                        ? entity.getDsSinhVien().stream().map(coreMapper::toDomain).collect(Collectors.toList()) 
                        : new ArrayList<>())
                .build();
    }

    public LopHocJpaEntity toJpaEntity(LopHoc domain) {
        if (domain == null) return null;
        return LopHocJpaEntity.builder()
                .maLopHoc(domain.getMaLopHoc())
                .nhom(domain.getNhom())
                .phongHoc(domain.getPhongHoc())
                .tietBatDau(domain.getTietBatDau())
                .thoiGian(domain.getThoiGian())
                .monHoc(coreMapper.toJpaEntity(domain.getMonHoc()))
                .giaoVien(coreMapper.toJpaEntity(domain.getGiaoVien()))
                // Dùng đúng HocKiJpaEntity (i ngắn)
                .hocKi(domain.getHocKi() != null ? HocKiJpaEntity.builder()
                        .maHocKi(domain.getHocKi().getMaHocKi())
                        .build() : null)
                .dsSinhVien(domain.getDsSinhVien() != null 
                        ? domain.getDsSinhVien().stream().map(coreMapper::toJpaEntity).collect(Collectors.toList()) 
                        : new ArrayList<>())
                .build();
    }

    // --- Lich Thi ---
    public LichThi toDomain(LichThiJpaEntity entity) {
        if (entity == null) return null;
        return LichThi.builder()
                .maLichThi(entity.getMaLichThi())
                .kiThi(coreMapper.toDomain(entity.getKiThi()))
                .monHoc(coreMapper.toDomain(entity.getMonHoc()))
                .phongThi(entity.getPhongThi())
                .thoiGian(entity.getThoiGian())
                .tietBatDau(entity.getTietBatDau())
                .hinhThucThi(entity.getHinhThucThi())
                .giaoVienCoiThi(coreMapper.toDomain(entity.getGiaoVienCoiThi()))
                .dsSinhVien(entity.getDsSinhVien() != null 
                        ? entity.getDsSinhVien().stream().map(coreMapper::toDomain).collect(Collectors.toList()) 
                        : new ArrayList<>())
                .dsGiamThi(entity.getDsGiamThi() != null 
                        ? entity.getDsGiamThi().stream().map(coreMapper::toDomain).collect(Collectors.toList()) 
                        : new ArrayList<>())
                .build();
    }

    public LichThiJpaEntity toJpaEntity(LichThi domain) {
        if (domain == null) return null;
        return LichThiJpaEntity.builder()
                .maLichThi(domain.getMaLichThi())
                .kiThi(coreMapper.toJpaEntity(domain.getKiThi()))
                .monHoc(coreMapper.toJpaEntity(domain.getMonHoc()))
                .phongThi(domain.getPhongThi())
                .thoiGian(domain.getThoiGian())
                .tietBatDau(domain.getTietBatDau())
                .hinhThucThi(domain.getHinhThucThi())
                .giaoVienCoiThi(coreMapper.toJpaEntity(domain.getGiaoVienCoiThi()))
                .dsSinhVien(domain.getDsSinhVien() != null 
                        ? domain.getDsSinhVien().stream().map(coreMapper::toJpaEntity).collect(Collectors.toList()) 
                        : new ArrayList<>())
                .dsGiamThi(domain.getDsGiamThi() != null 
                        ? domain.getDsGiamThi().stream().map(coreMapper::toJpaEntity).collect(Collectors.toList()) 
                        : new ArrayList<>())
                .build();
    }

    // --- Diem Thi ---
    public DiemThi toDomain(DiemThiJpaEntity entity) {
        if (entity == null) return null;
        return DiemThi.builder()
                .id(entity.getId())
                .diemA(entity.getDiemA()).diemB(entity.getDiemB()).diemC(entity.getDiemC())
                .diemTb(entity.getDiemTb()).diemChu(entity.getDiemChu())
                .sinhVien(coreMapper.toDomain(entity.getSinhVien()))
                .lopHoc(toDomain(entity.getLopHoc()))
                .build();
    }

    public DiemThiJpaEntity toJpaEntity(DiemThi domain) {
        if (domain == null) return null;
        return DiemThiJpaEntity.builder()
                .id(domain.getId())
                .diemA(domain.getDiemA()).diemB(domain.getDiemB()).diemC(domain.getDiemC())
                .diemTb(domain.getDiemTb()).diemChu(domain.getDiemChu())
                .sinhVien(coreMapper.toJpaEntity(domain.getSinhVien()))
                .lopHoc(toJpaEntity(domain.getLopHoc()))
                .build();
    }

    // --- User ---
    public User toDomain(UserJpaEntity entity) {
        if (entity == null) return null;
        return User.builder()
                .id(entity.getId())
                .username(entity.getUsername())
                .password(entity.getPassword())
                .role(entity.getRole())
                .sinhVien(coreMapper.toDomain(entity.getSinhVien()))
                .giaoVien(coreMapper.toDomain(entity.getGiaoVien()))
                .build();
    }

    public UserJpaEntity toJpaEntity(User domain) {
        if (domain == null) return null;
        return UserJpaEntity.builder()
                .id(domain.getId())
                .username(domain.getUsername())
                .password(domain.getPassword())
                .role(domain.getRole())
                .sinhVien(coreMapper.toJpaEntity(domain.getSinhVien()))
                .giaoVien(coreMapper.toJpaEntity(domain.getGiaoVien()))
                .build();
    }
}