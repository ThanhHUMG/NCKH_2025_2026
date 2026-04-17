package com.nckh.htql_thi.infrastructure.adapter;

import com.nckh.htql_thi.application.port.out.MonThiPort;
import com.nckh.htql_thi.domain.entity.MonThi;
import com.nckh.htql_thi.infrastructure.repository.MonThiRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class MonThiPersistenceAdapter implements MonThiPort {

    private final MonThiRepository monThiRepository;

    public MonThiPersistenceAdapter(MonThiRepository monThiRepository) {
        this.monThiRepository = monThiRepository;
    }

    @Override
    public List<MonThi> layTatCa() {
        return monThiRepository.findAll();
    }

    @Override
    public Optional<MonThi> timTheoId(Long id) {
        return monThiRepository.findById(id);
    }

    @Override
    public MonThi luu(MonThi monThi) {
        return monThiRepository.save(monThi);
    }

    @Override
    public void xoa(Long id) {
        monThiRepository.deleteById(id);
    }

    @Override
    public List<MonThi> findByKiThi(Long maKiThi) {
        return monThiRepository.findByKiThi_MaKiThi(maKiThi);
    }

    @Override
    public List<MonThi> findByGiaoVien(Long maGiaoVien) {
        return monThiRepository.findByLopHoc_GiaoVien_MaGiaoVien(maGiaoVien);
    }
    @Override
    public boolean existsByLopHocAndKiThi(Long maLopHoc, Long maKiThi) {
        return monThiRepository.existsByLopHoc_MaLopHocAndKiThi_MaKiThi(maLopHoc, maKiThi);
    }
}