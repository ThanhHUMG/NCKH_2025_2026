package com.nckh.htql_thi.infrastructure.persistence.adapter;

import com.nckh.htql_thi.application.port.out.DiemThiPort;
import com.nckh.htql_thi.domain.entity.DiemThi;
import com.nckh.htql_thi.infrastructure.persistence.entity.DiemThiJpaEntity;
import com.nckh.htql_thi.infrastructure.persistence.mapper.ComplexMapper;
import com.nckh.htql_thi.infrastructure.persistence.repository.DiemThiRepository;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class DiemThiPersistenceAdapter implements DiemThiPort {
    private final DiemThiRepository repository;
    private final ComplexMapper mapper;

    public DiemThiPersistenceAdapter(DiemThiRepository repository, ComplexMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public DiemThi luu(DiemThi diemThi) {
        DiemThiJpaEntity saved = repository.save(mapper.toJpaEntity(diemThi));
        return mapper.toDomain(saved);
    }
    
    @Override
    public void xoa(Long id) { repository.deleteById(id); }

    @Override
    public Optional<DiemThi> findBySinhVienAndLopHoc(Long msv, Long maLopHoc) {
        return repository.findBySinhVien_MsvAndLopHoc_MaLopHoc(msv, maLopHoc).map(mapper::toDomain);
    }

    @Override
    public List<DiemThi> findByLopHoc(Long maLopHoc) {
        return repository.findByLopHoc_MaLopHoc(maLopHoc).stream().map(mapper::toDomain).collect(Collectors.toList());
    }

    @Override
    public List<DiemThi> findBySinhVien(Long msv) {
        return repository.findBySinhVien_Msv(msv).stream().map(mapper::toDomain).collect(Collectors.toList());
    }
}