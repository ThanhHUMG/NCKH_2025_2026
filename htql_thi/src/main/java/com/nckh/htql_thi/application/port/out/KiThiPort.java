package com.nckh.htql_thi.application.port.out;

import com.nckh.htql_thi.domain.entity.KiThi;
import java.util.List;
import java.util.Optional;

public interface KiThiPort {
    List<KiThi> layTatCa();
    Optional<KiThi> timTheoId(Long id);
    KiThi luu(KiThi kiThi);
    void xoa(Long id);
}