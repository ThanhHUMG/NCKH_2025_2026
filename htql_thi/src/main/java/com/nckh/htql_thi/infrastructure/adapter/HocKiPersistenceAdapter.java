package com.nckh.htql_thi.infrastructure.adapter;

import com.nckh.htql_thi.application.port.out.HocKiPort;
import com.nckh.htql_thi.domain.entity.HocKi;
import com.nckh.htql_thi.infrastructure.repository.HocKiRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class HocKiPersistenceAdapter implements HocKiPort {

    private final HocKiRepository hocKiRepository;

    public HocKiPersistenceAdapter(HocKiRepository hocKiRepository) {
        this.hocKiRepository = hocKiRepository;
    }

    @Override
    public List<HocKi> layTatCa() {
        return hocKiRepository.findAll();
    }

    @Override
    public Optional<HocKi> timTheoId(Long id) {
        return hocKiRepository.findById(id);
    }

    @Override
    public HocKi luu(HocKi hocKi) {
        return hocKiRepository.save(hocKi);
    }

    @Override
    public void xoa(Long id) {
        hocKiRepository.deleteById(id);
    }

    @Override
    public void luuDanhSach(List<HocKi> list) {
        hocKiRepository.saveAll(list);
    }
}