package com.nckh.htql_thi.infrastructure.persistence.mapper;

import com.nckh.htql_thi.domain.entity.HocKi;
import com.nckh.htql_thi.infrastructure.persistence.entity.HocKiJpaEntity;
import org.springframework.stereotype.Component;

@Component
public class HocKiMapper {
    public HocKi toDomain(HocKiJpaEntity entity) {
        if (entity == null) return null;
        return HocKi.builder().maHocKi(entity.getMaHocKi()).tenHocKy(entity.getTenHocKy()).build();
    }
    public HocKiJpaEntity toJpaEntity(HocKi domain) {
        if (domain == null) return null;
        return HocKiJpaEntity.builder().maHocKi(domain.getMaHocKi()).tenHocKy(domain.getTenHocKy()).build();
    }
}