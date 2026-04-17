package com.nckh.htql_thi.application.port.in;

import com.nckh.htql_thi.domain.entity.SinhVien;

import java.io.InputStream;
import java.util.List;

public interface ManageSinhVienUseCase {

    List<SinhVien> getAllSinhVien();

    SinhVien getSinhVienById(Long id);

    SinhVien createSinhVien(SinhVien sinhVien);

    SinhVien updateSinhVien(Long id, SinhVien sinhVien);

    void deleteSinhVien(Long id);

    void importExcel(InputStream inputStream);
}