package com.nckh.htql_thi.infrastructure.adapter;

import com.nckh.htql_thi.application.port.out.SinhVienPort;
import com.nckh.htql_thi.domain.entity.SinhVien;
import com.nckh.htql_thi.infrastructure.repository.SinhVienRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class SinhVienPersistenceAdapter implements SinhVienPort {

    private final SinhVienRepository sinhVienRepository;

    public SinhVienPersistenceAdapter(SinhVienRepository sinhVienRepository) {
        this.sinhVienRepository = sinhVienRepository;
    }

    @Override
    public List<SinhVien> layTatCa() {
        return sinhVienRepository.findAll();
    }

    @Override
    public Optional<SinhVien> timTheoId(Long id) {
        return sinhVienRepository.findById(id);
    }

    @Override
    public SinhVien luu(SinhVien sinhVien) {
        return sinhVienRepository.save(sinhVien);
    }

    @Override
    public void xoa(Long id) {
        sinhVienRepository.deleteById(id);
    }

    @Override
    public void luuDanhSach(List<SinhVien> list) {
        sinhVienRepository.saveAll(list);
    }

    @Override
    public boolean existsByEmail(String email) {
        return sinhVienRepository.existsByEmail(email);
    }

    @Override
    public boolean existsBySoDienThoai(String soDienThoai) {
        return sinhVienRepository.existsBySoDienThoai(soDienThoai);
    }
}