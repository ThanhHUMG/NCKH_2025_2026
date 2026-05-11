package com.nckh.htql_thi.infrastructure.persistence.adapter;

import com.nckh.htql_thi.application.port.out.KhoaPort;
import com.nckh.htql_thi.domain.entity.Khoa;
import com.nckh.htql_thi.infrastructure.persistence.entity.KhoaJpaEntity;
import com.nckh.htql_thi.infrastructure.persistence.mapper.KhoaMapper;
import com.nckh.htql_thi.infrastructure.persistence.repository.KhoaRepository;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class KhoaPersistenceAdapter implements KhoaPort {
    private final KhoaRepository repository;
    private final KhoaMapper mapper;

    public KhoaPersistenceAdapter(KhoaRepository repository, KhoaMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public List<Khoa> layTatCa() {
        return repository.findAll().stream().map(mapper::toDomain).collect(Collectors.toList());
    }

    @Override
    public Optional<Khoa> timTheoId(Long id) {
        return repository.findById(id).map(mapper::toDomain);
    }

    @Override
    public Optional<Khoa> timTheoTen(String tenKhoa) {
        return repository.findByTenKhoa(tenKhoa).map(mapper::toDomain);
    }

    @Override
    public Khoa luu(Khoa khoa) {
        KhoaJpaEntity saved = repository.save(mapper.toJpaEntity(khoa));
        return mapper.toDomain(saved);
    }

    @Override
    public void xoa(Long id) { repository.deleteById(id); }

    @Override
    public void luuDanhSach(List<Khoa> list) {
        repository.saveAll(list.stream().map(mapper::toJpaEntity).collect(Collectors.toList()));
    }

    @Override
    public boolean existsByTenKhoa(String tenKhoa) {
        return repository.existsByTenKhoa(tenKhoa);
    }
}