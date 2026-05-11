package com.nckh.htql_thi.infrastructure.persistence.adapter;

import com.nckh.htql_thi.application.port.out.GiaoVienPort;
import com.nckh.htql_thi.domain.entity.GiaoVien;
import com.nckh.htql_thi.infrastructure.persistence.entity.GiaoVienJpaEntity;
import com.nckh.htql_thi.infrastructure.persistence.mapper.CoreMapper;
import com.nckh.htql_thi.infrastructure.persistence.repository.GiaoVienRepository;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class GiaoVienPersistenceAdapter implements GiaoVienPort {
    private final GiaoVienRepository repository;
    private final CoreMapper mapper;

    public GiaoVienPersistenceAdapter(GiaoVienRepository repository, CoreMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public List<GiaoVien> layTatCa() {
        return repository.findAll().stream().map(mapper::toDomain).collect(Collectors.toList());
    }

    @Override
    public Optional<GiaoVien> timTheoId(Long id) {
        return repository.findById(id).map(mapper::toDomain);
    }

    @Override
    public GiaoVien luu(GiaoVien giaoVien) {
        GiaoVienJpaEntity saved = repository.save(mapper.toJpaEntity(giaoVien));
        return mapper.toDomain(saved);
    }

    @Override
    public void xoa(Long id) { repository.deleteById(id); }

    @Override
    public void luuDanhSach(List<GiaoVien> list) {
        repository.saveAll(list.stream().map(mapper::toJpaEntity).collect(Collectors.toList()));
    }

    @Override
    public boolean existsByEmail(String email) { return repository.existsByEmail(email); }

    @Override
    public boolean existsBySoDienThoai(String soDienThoai) { return repository.existsBySoDienThoai(soDienThoai); }

    @Override
    public List<GiaoVien> findAllByIds(List<Long> ids) {
        return repository.findAllById(ids).stream().map(mapper::toDomain).collect(Collectors.toList());
    }
}