package com.nckh.htql_thi.application.port.in;

import com.nckh.htql_thi.domain.entity.HocKi;

import java.io.InputStream;
import java.util.List;

public interface ManageHocKiUseCase {

    List<HocKi> getAllHocKi();

    HocKi getHocKiById(Long id);

    HocKi createHocKi(HocKi hocKi);

    HocKi updateHocKi(Long id, HocKi hocKi);

    void deleteHocKi(Long id);

    void importExcel(InputStream inputStream);
}