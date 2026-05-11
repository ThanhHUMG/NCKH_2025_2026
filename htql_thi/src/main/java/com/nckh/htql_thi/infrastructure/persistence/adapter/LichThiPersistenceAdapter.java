package com.nckh.htql_thi.infrastructure.persistence.adapter;

import com.nckh.htql_thi.application.port.out.LichThiPort;
import com.nckh.htql_thi.domain.entity.LichThi;
import com.nckh.htql_thi.infrastructure.persistence.entity.LichThiJpaEntity;
import com.nckh.htql_thi.infrastructure.persistence.mapper.ComplexMapper;
import com.nckh.htql_thi.infrastructure.persistence.repository.LichThiRepository;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class LichThiPersistenceAdapter implements LichThiPort {
    private final LichThiRepository repository;
    private final ComplexMapper mapper;

    public LichThiPersistenceAdapter(LichThiRepository repository, ComplexMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public List<LichThi> layTatCa() {
        return repository.findAll().stream().map(mapper::toDomain).collect(Collectors.toList());
    }

    @Override
    public Optional<LichThi> timTheoId(Long id) {
        return repository.findById(id).map(mapper::toDomain);
    }

    @Override
    public LichThi luu(LichThi lichThi) {
        LichThiJpaEntity saved = repository.save(mapper.toJpaEntity(lichThi));
        return mapper.toDomain(saved);
    }

    @Override
    public void luuDanhSach(List<LichThi> list) {
        repository.saveAll(list.stream().map(mapper::toJpaEntity).collect(Collectors.toList()));
    }

    @Override
    public void xoa(Long id) { repository.deleteById(id); }

    @Override
    public List<LichThi> findByKiThi(Long maKiThi) {
        return repository.findByKiThi_MaKiThi(maKiThi).stream().map(mapper::toDomain).collect(Collectors.toList());
    }

    @Override
    public List<LichThi> findByGiaoVien(Long maGiaoVien) {
        return repository.findByGiaoVienCoiThi_MaGiaoVien(maGiaoVien).stream()
                .map(mapper::toDomain).collect(Collectors.toList());
    }

    @Override
    public List<LichThi> findBySinhVien(Long msv) {
        return repository.findByDsSinhVien_Msv(msv).stream().map(mapper::toDomain).collect(Collectors.toList());
    }
}