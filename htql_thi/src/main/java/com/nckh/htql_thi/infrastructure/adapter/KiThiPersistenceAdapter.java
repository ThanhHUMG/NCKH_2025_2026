package com.nckh.htql_thi.infrastructure.adapter;

import com.nckh.htql_thi.application.port.out.KiThiPort;
import com.nckh.htql_thi.domain.entity.KiThi;
import com.nckh.htql_thi.infrastructure.repository.KiThiRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class KiThiPersistenceAdapter implements KiThiPort {

    private final KiThiRepository kiThiRepository;

    public KiThiPersistenceAdapter(KiThiRepository kiThiRepository) {
        this.kiThiRepository = kiThiRepository;
    }

    @Override
    public List<KiThi> layTatCa() {
        return kiThiRepository.findAll();
    }

    @Override
    public Optional<KiThi> timTheoId(Long id) {
        return kiThiRepository.findById(id);
    }

    @Override
    public KiThi luu(KiThi kiThi) {
        return kiThiRepository.save(kiThi);
    }

    @Override
    public void xoa(Long id) {
        kiThiRepository.deleteById(id);
    }
}