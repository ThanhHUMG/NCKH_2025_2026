package com.nckh.htql_thi.application.port.in;

import com.nckh.htql_thi.domain.entity.Khoa;

import java.io.InputStream;
import java.util.List;

public interface ManageKhoaUseCase {

    List<Khoa> getAllKhoa();

    Khoa getKhoaById(Long id);

    Khoa createKhoa(Khoa khoa);

    Khoa updateKhoa(Long id, Khoa khoa);

    void deleteKhoa(Long id);

    void importExcel(InputStream inputStream);
}