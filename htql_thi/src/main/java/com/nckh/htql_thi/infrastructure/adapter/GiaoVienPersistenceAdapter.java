package com.nckh.htql_thi.infrastructure.adapter;

import com.nckh.htql_thi.application.port.out.GiaoVienPort;
import com.nckh.htql_thi.domain.entity.GiaoVien;
import com.nckh.htql_thi.infrastructure.repository.GiaoVienRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class GiaoVienPersistenceAdapter implements GiaoVienPort {

    private final GiaoVienRepository giaoVienRepository;

    public GiaoVienPersistenceAdapter(GiaoVienRepository giaoVienRepository) {
        this.giaoVienRepository = giaoVienRepository;
    }

    @Override
    public List<GiaoVien> layTatCa() {
        return giaoVienRepository.findAll();
    }

    @Override
    public Optional<GiaoVien> timTheoId(Long id) {
        return giaoVienRepository.findById(id);
    }

    @Override
    public GiaoVien luu(GiaoVien giaoVien) {
        return giaoVienRepository.save(giaoVien);
    }

    @Override
    public void xoa(Long id) {
        giaoVienRepository.deleteById(id);
    }

    @Override
    public void luuDanhSach(List<GiaoVien> list) {
        giaoVienRepository.saveAll(list);
    }

    @Override
    public boolean existsByEmail(String email) {
        return giaoVienRepository.existsByEmail(email);
    }

    @Override
    public boolean existsBySoDienThoai(String soDienThoai) {
        return giaoVienRepository.existsBySoDienThoai(soDienThoai);
    }

    @Override
    public List<GiaoVien> findAllByIds(List<Long> ids) {
        return giaoVienRepository.findAllById(ids);
    }
}