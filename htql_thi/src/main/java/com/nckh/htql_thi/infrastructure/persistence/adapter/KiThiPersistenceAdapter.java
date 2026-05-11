package com.nckh.htql_thi.infrastructure.persistence.adapter;

import com.nckh.htql_thi.application.port.out.KiThiPort;
import com.nckh.htql_thi.domain.entity.KiThi;
import com.nckh.htql_thi.infrastructure.persistence.entity.KiThiJpaEntity;
import com.nckh.htql_thi.infrastructure.persistence.mapper.CoreMapper;
import com.nckh.htql_thi.infrastructure.persistence.repository.KiThiRepository;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class KiThiPersistenceAdapter implements KiThiPort {
    private final KiThiRepository repository;
    private final CoreMapper mapper;

    public KiThiPersistenceAdapter(KiThiRepository repository, CoreMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public List<KiThi> layTatCa() {
        return repository.findAll().stream().map(mapper::toDomain).collect(Collectors.toList());
    }

    @Override
    public Optional<KiThi> timTheoId(Long id) {
        return repository.findById(id).map(mapper::toDomain);
    }

    @Override
    public KiThi luu(KiThi kiThi) {
        KiThiJpaEntity saved = repository.save(mapper.toJpaEntity(kiThi));
        return mapper.toDomain(saved);
    }

    @Override
    public void xoa(Long id) { repository.deleteById(id); }
}