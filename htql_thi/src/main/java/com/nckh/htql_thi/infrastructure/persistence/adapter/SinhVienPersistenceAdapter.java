package com.nckh.htql_thi.infrastructure.persistence.adapter;

import com.nckh.htql_thi.application.port.out.SinhVienPort;
import com.nckh.htql_thi.domain.entity.SinhVien;
import com.nckh.htql_thi.infrastructure.persistence.entity.SinhVienJpaEntity;
import com.nckh.htql_thi.infrastructure.persistence.mapper.CoreMapper;
import com.nckh.htql_thi.infrastructure.persistence.repository.SinhVienRepository;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class SinhVienPersistenceAdapter implements SinhVienPort {
    private final SinhVienRepository repository;
    private final CoreMapper mapper;

    public SinhVienPersistenceAdapter(SinhVienRepository repository, CoreMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public List<SinhVien> layTatCa() {
        return repository.findAll().stream().map(mapper::toDomain).collect(Collectors.toList());
    }

    @Override
    public Optional<SinhVien> timTheoId(Long id) {
        return repository.findById(id).map(mapper::toDomain);
    }

    @Override
    public SinhVien luu(SinhVien sinhVien) {
        SinhVienJpaEntity saved = repository.save(mapper.toJpaEntity(sinhVien));
        return mapper.toDomain(saved);
    }

    @Override
    public void xoa(Long id) { repository.deleteById(id); }

    @Override
    public void luuDanhSach(List<SinhVien> list) {
        repository.saveAll(list.stream().map(mapper::toJpaEntity).collect(Collectors.toList()));
    }

    @Override
    public boolean existsByEmail(String email) { return repository.existsByEmail(email); }

    @Override
    public boolean existsBySoDienThoai(String soDienThoai) { return repository.existsBySoDienThoai(soDienThoai); }
}