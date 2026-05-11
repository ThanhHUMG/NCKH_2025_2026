package com.nckh.htql_thi.infrastructure.persistence.adapter;

import com.nckh.htql_thi.application.port.out.LopHocPort;
import com.nckh.htql_thi.domain.entity.LopHoc;
import com.nckh.htql_thi.infrastructure.persistence.entity.LopHocJpaEntity;
import com.nckh.htql_thi.infrastructure.persistence.mapper.ComplexMapper;
import com.nckh.htql_thi.infrastructure.persistence.repository.LopHocRepository;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class LopHocPersistenceAdapter implements LopHocPort {
    private final LopHocRepository repository;
    private final ComplexMapper mapper;

    public LopHocPersistenceAdapter(LopHocRepository repository, ComplexMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public List<LopHoc> layTatCa() {
        return repository.findAll().stream().map(mapper::toDomain).collect(Collectors.toList());
    }

    @Override
    public Optional<LopHoc> timTheoId(Long id) {
        return repository.findById(id).map(mapper::toDomain);
    }

    @Override
    public LopHoc luu(LopHoc lopHoc) {
        LopHocJpaEntity saved = repository.save(mapper.toJpaEntity(lopHoc));
        return mapper.toDomain(saved);
    }

    @Override
    public void xoa(Long id) { repository.deleteById(id); }

    @Override
    public List<LopHoc> findByGiaoVien(Long maGiaoVien) {
        return repository.findByGiaoVien_MaGiaoVien(maGiaoVien).stream()
                .map(mapper::toDomain).collect(Collectors.toList());
    }

    @Override
    public List<LopHoc> findByHocKi(Long maHocKi) {
        return repository.findByHocKi_MaHocKi(maHocKi).stream()
                .map(mapper::toDomain).collect(Collectors.toList());
    }
}