package com.nckh.htql_thi.infrastructure.persistence.adapter;

import com.nckh.htql_thi.application.port.out.HocKiPort;
import com.nckh.htql_thi.domain.entity.HocKi;
import com.nckh.htql_thi.infrastructure.persistence.entity.HocKiJpaEntity;
import com.nckh.htql_thi.infrastructure.persistence.mapper.HocKiMapper;
import com.nckh.htql_thi.infrastructure.persistence.repository.HocKiRepository;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class HocKiPersistenceAdapter implements HocKiPort {
    private final HocKiRepository repository;
    private final HocKiMapper mapper;

    public HocKiPersistenceAdapter(HocKiRepository repository, HocKiMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public List<HocKi> layTatCa() {
        return repository.findAll().stream().map(mapper::toDomain).collect(Collectors.toList());
    }

    @Override
    public Optional<HocKi> timTheoId(Long id) {
        return repository.findById(id).map(mapper::toDomain);
    }

    @Override
    public HocKi luu(HocKi hocKi) {
        HocKiJpaEntity saved = repository.save(mapper.toJpaEntity(hocKi));
        return mapper.toDomain(saved);
    }

    @Override
    public void xoa(Long id) { repository.deleteById(id); }

    @Override
    public void luuDanhSach(List<HocKi> list) {
        repository.saveAll(list.stream().map(mapper::toJpaEntity).collect(Collectors.toList()));
    }
}