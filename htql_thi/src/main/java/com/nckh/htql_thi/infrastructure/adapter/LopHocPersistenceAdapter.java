package com.nckh.htql_thi.infrastructure.adapter;

import com.nckh.htql_thi.application.port.out.LopHocPort;
import com.nckh.htql_thi.domain.entity.LopHoc;
import com.nckh.htql_thi.infrastructure.repository.LopHocRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class LopHocPersistenceAdapter implements LopHocPort {

    private final LopHocRepository lopHocRepository;

    public LopHocPersistenceAdapter(LopHocRepository lopHocRepository) {
        this.lopHocRepository = lopHocRepository;
    }

    @Override
    public List<LopHoc> layTatCa() {
        return lopHocRepository.findAll();
    }

    @Override
    public Optional<LopHoc> timTheoId(Long id) {
        return lopHocRepository.findById(id);
    }

    @Override
    public LopHoc luu(LopHoc lopHoc) {
        return lopHocRepository.save(lopHoc);
    }

    @Override
    public void xoa(Long id) {
        lopHocRepository.deleteById(id);
    }

    @Override
    public List<LopHoc> findByGiaoVien(Long maGiaoVien) {
        return lopHocRepository.findByGiaoVien_MaGiaoVien(maGiaoVien);
    }

    @Override
    public List<LopHoc> findByHocKi(Long maHocKi) {
        return lopHocRepository.findByHocKi_MaHocKi(maHocKi);
    }
}