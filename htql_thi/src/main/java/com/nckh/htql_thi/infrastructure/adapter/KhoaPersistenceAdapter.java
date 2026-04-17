package com.nckh.htql_thi.infrastructure.adapter;

import com.nckh.htql_thi.application.port.out.KhoaPort;
import com.nckh.htql_thi.domain.entity.Khoa;
import com.nckh.htql_thi.infrastructure.repository.KhoaRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class KhoaPersistenceAdapter implements KhoaPort {

    private final KhoaRepository khoaRepository;

    public KhoaPersistenceAdapter(KhoaRepository khoaRepository) {
        this.khoaRepository = khoaRepository;
    }

    @Override
    public List<Khoa> layTatCa() {
        return khoaRepository.findAll();
    }

    @Override
    public Optional<Khoa> timTheoId(Long id) {
        return khoaRepository.findById(id);
    }

    @Override
    public Optional<Khoa> timTheoTen(String tenKhoa) {
        return khoaRepository.findByTenKhoa(tenKhoa);
    }

    @Override
    public Khoa luu(Khoa khoa) {
        return khoaRepository.save(khoa);
    }

    @Override
    public void xoa(Long id) {
        khoaRepository.deleteById(id);
    }

    @Override
    public void luuDanhSach(List<Khoa> list) {
        khoaRepository.saveAll(list);
    }

    @Override
    public boolean existsByTenKhoa(String tenKhoa) {
        return khoaRepository.existsByTenKhoa(tenKhoa);
    }
}