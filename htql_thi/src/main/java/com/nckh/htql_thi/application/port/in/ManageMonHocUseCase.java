package com.nckh.htql_thi.application.port.in;

import com.nckh.htql_thi.domain.entity.MonHoc;

import java.io.InputStream;
import java.util.List;

public interface ManageMonHocUseCase {

    List<MonHoc> getAllMonHoc();

    MonHoc getMonHocById(Long id);

    MonHoc createMonHoc(MonHoc monHoc);

    MonHoc updateMonHoc(Long id, MonHoc monHoc);

    void deleteMonHoc(Long id);

    void importExcel(InputStream inputStream);
}