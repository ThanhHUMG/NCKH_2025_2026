package com.nckh.htql_thi.infrastructure.persistence.mapper;

import com.nckh.htql_thi.domain.entity.Khoa;
import com.nckh.htql_thi.infrastructure.persistence.entity.KhoaJpaEntity;
import org.springframework.stereotype.Component;

@Component
public class KhoaMapper {
    public Khoa toDomain(KhoaJpaEntity entity) {
        if (entity == null) return null;
        return Khoa.builder().maKhoa(entity.getMaKhoa()).tenKhoa(entity.getTenKhoa()).build();
    }
    public KhoaJpaEntity toJpaEntity(Khoa domain) {
        if (domain == null) return null;
        return KhoaJpaEntity.builder().maKhoa(domain.getMaKhoa()).tenKhoa(domain.getTenKhoa()).build();
    }
}