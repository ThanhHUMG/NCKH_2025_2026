package com.nckh.htql_thi.application.port.out;

import com.nckh.htql_thi.domain.entity.HocKi;

import java.util.List;
import java.util.Optional;

public interface HocKiPort {

    List<HocKi> layTatCa();

    Optional<HocKi> timTheoId(Long id);

    HocKi luu(HocKi hocKi);

    void xoa(Long id);

    void luuDanhSach(List<HocKi> list);
}