package com.nckh.htql_thi.infrastructure.persistence.adapter;

import com.nckh.htql_thi.application.port.out.MonHocPort;
import com.nckh.htql_thi.domain.entity.MonHoc;
import com.nckh.htql_thi.infrastructure.persistence.entity.MonHocJpaEntity;
import com.nckh.htql_thi.infrastructure.persistence.mapper.CoreMapper;
import com.nckh.htql_thi.infrastructure.persistence.repository.MonHocRepository;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class MonHocPersistenceAdapter implements MonHocPort {
    private final MonHocRepository repository;
    private final CoreMapper mapper;

    public MonHocPersistenceAdapter(MonHocRepository repository, CoreMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public List<MonHoc> layTatCa() {
        return repository.findAll().stream().map(mapper::toDomain).collect(Collectors.toList());
    }

    @Override
    public Optional<MonHoc> timTheoId(Long id) {
        return repository.findById(id).map(mapper::toDomain);
    }

    @Override
    public MonHoc luu(MonHoc monHoc) {
        MonHocJpaEntity saved = repository.save(mapper.toJpaEntity(monHoc));
        return mapper.toDomain(saved);
    }

    @Override
    public void xoa(Long id) { repository.deleteById(id); }

    @Override
    public void luuDanhSach(List<MonHoc> list) {
        repository.saveAll(list.stream().map(mapper::toJpaEntity).collect(Collectors.toList()));
    }
}