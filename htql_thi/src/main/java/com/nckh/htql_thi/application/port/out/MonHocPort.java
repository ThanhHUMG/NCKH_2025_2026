package com.nckh.htql_thi.application.port.out;

import com.nckh.htql_thi.domain.entity.MonHoc;
import java.util.List;
import java.util.Optional;

public interface MonHocPort {
    List<MonHoc> layTatCa();
    Optional<MonHoc> timTheoId(Long id);
    MonHoc luu(MonHoc monHoc);
    void xoa(Long id);
    void luuDanhSach(List<MonHoc> list);
}