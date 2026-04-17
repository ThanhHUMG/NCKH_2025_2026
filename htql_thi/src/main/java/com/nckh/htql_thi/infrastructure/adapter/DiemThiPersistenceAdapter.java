package com.nckh.htql_thi.infrastructure.adapter;

import com.nckh.htql_thi.application.port.out.DiemThiPort;
import com.nckh.htql_thi.domain.entity.DiemThi;
import com.nckh.htql_thi.infrastructure.repository.DiemThiRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class DiemThiPersistenceAdapter implements DiemThiPort {

    private final DiemThiRepository diemThiRepository;

    public DiemThiPersistenceAdapter(DiemThiRepository diemThiRepository) {
        this.diemThiRepository = diemThiRepository;
    }

    @Override
    public List<DiemThi> layTatCa() {
        return diemThiRepository.findAll();
    }

    @Override
    public Optional<DiemThi> timTheoId(Long id) {
        return diemThiRepository.findById(id);
    }

    @Override
    public DiemThi luu(DiemThi diemThi) {
        return diemThiRepository.save(diemThi);
    }

    @Override
    public void xoa(Long id) {
        diemThiRepository.deleteById(id);
    }

    @Override
    public Optional<DiemThi> findBySinhVienAndMonThi(Long msv, Long maMonThi) {
        return diemThiRepository.findBySinhVien_MsvAndMonThi_MaMonThi(msv, maMonThi);
    }

    @Override
    public List<DiemThi> findByMonThi(Long maMonThi) {
        return diemThiRepository.findByMonThi_MaMonThi(maMonThi);
    }

    @Override
    public List<DiemThi> findBySinhVien(Long msv) {
        return diemThiRepository.findBySinhVien_Msv(msv);
    }
}