package com.nckh.htql_thi.infrastructure.adapter;

import com.nckh.htql_thi.application.port.out.MonHocPort;
import com.nckh.htql_thi.domain.entity.MonHoc;
import com.nckh.htql_thi.infrastructure.repository.MonHocRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class MonHocPersistenceAdapter implements MonHocPort {

    private final MonHocRepository monHocRepository;

    public MonHocPersistenceAdapter(MonHocRepository monHocRepository) {
        this.monHocRepository = monHocRepository;
    }

    @Override
    public List<MonHoc> layTatCa() {
        return monHocRepository.findAll();
    }

    @Override
    public Optional<MonHoc> timTheoId(Long id) {
        return monHocRepository.findById(id);
    }

    @Override
    public MonHoc luu(MonHoc monHoc) {
        return monHocRepository.save(monHoc);
    }

    @Override
    public void xoa(Long id) {
        monHocRepository.deleteById(id);
    }

    @Override
    public void luuDanhSach(List<MonHoc> list) {
        monHocRepository.saveAll(list);
    }
}