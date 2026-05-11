package com.nckh.htql_thi.infrastructure.persistence.mapper;

import com.nckh.htql_thi.domain.entity.*;
import com.nckh.htql_thi.infrastructure.persistence.entity.*;
import org.springframework.stereotype.Component;
import java.util.stream.Collectors;

@Component
public class CoreMapper {
    
    private final KhoaMapper khoaMapper;
    private final HocKiMapper hocKiMapper;

    public CoreMapper(KhoaMapper khoaMapper, HocKiMapper hocKiMapper) {
        this.khoaMapper = khoaMapper;
        this.hocKiMapper = hocKiMapper;
    }

    // --- Sinh Vien ---
    public SinhVien toDomain(SinhVienJpaEntity entity) {
        if (entity == null) return null;
        return SinhVien.builder().msv(entity.getMsv()).hoTen(entity.getHoTen())
                .namSinh(entity.getNamSinh()).nienKhoa(entity.getNienKhoa())
                .soDienThoai(entity.getSoDienThoai()).email(entity.getEmail())
                .diaChi(entity.getDiaChi()).khoa(khoaMapper.toDomain(entity.getKhoa())).build();
    }
    public SinhVienJpaEntity toJpaEntity(SinhVien domain) {
        if (domain == null) return null;
        return SinhVienJpaEntity.builder().msv(domain.getMsv()).hoTen(domain.getHoTen())
                .namSinh(domain.getNamSinh()).nienKhoa(domain.getNienKhoa())
                .soDienThoai(domain.getSoDienThoai()).email(domain.getEmail())
                .diaChi(domain.getDiaChi()).khoa(khoaMapper.toJpaEntity(domain.getKhoa())).build();
    }

    // --- Giao Vien ---
    public GiaoVien toDomain(GiaoVienJpaEntity entity) {
        if (entity == null) return null;
        return GiaoVien.builder().maGiaoVien(entity.getMaGiaoVien()).hoTen(entity.getHoTen())
                .namSinh(entity.getNamSinh()).trinhDo(entity.getTrinhDo())
                .soDienThoai(entity.getSoDienThoai()).email(entity.getEmail())
                .diaChi(entity.getDiaChi()).khoa(khoaMapper.toDomain(entity.getKhoa())).build();
    }
    public GiaoVienJpaEntity toJpaEntity(GiaoVien domain) {
        if (domain == null) return null;
        return GiaoVienJpaEntity.builder().maGiaoVien(domain.getMaGiaoVien()).hoTen(domain.getHoTen())
                .namSinh(domain.getNamSinh()).trinhDo(domain.getTrinhDo())
                .soDienThoai(domain.getSoDienThoai()).email(domain.getEmail())
                .diaChi(domain.getDiaChi()).khoa(khoaMapper.toJpaEntity(domain.getKhoa())).build();
    }

    // --- Mon Hoc ---
    public MonHoc toDomain(MonHocJpaEntity entity) {
        if (entity == null) return null;
        return MonHoc.builder().maMonHoc(entity.getMaMonHoc()).tenMonHoc(entity.getTenMonHoc())
                .tinChi(entity.getTinChi()).khoa(khoaMapper.toDomain(entity.getKhoa())).build();
    }
    public MonHocJpaEntity toJpaEntity(MonHoc domain) {
        if (domain == null) return null;
        return MonHocJpaEntity.builder().maMonHoc(domain.getMaMonHoc()).tenMonHoc(domain.getTenMonHoc())
                .tinChi(domain.getTinChi()).khoa(khoaMapper.toJpaEntity(domain.getKhoa())).build();
    }

    // --- Ki Thi ---
    public KiThi toDomain(KiThiJpaEntity entity) {
        if (entity == null) return null;
        return KiThi.builder().maKiThi(entity.getMaKiThi()).tenKiThi(entity.getTenKiThi())
                .hocKi(hocKiMapper.toDomain(entity.getHocKi())).build();
    }
    public KiThiJpaEntity toJpaEntity(KiThi domain) {
        if (domain == null) return null;
        return KiThiJpaEntity.builder().maKiThi(domain.getMaKiThi()).tenKiThi(domain.getTenKiThi())
                .hocKi(hocKiMapper.toJpaEntity(domain.getHocKi())).build();
    }
}