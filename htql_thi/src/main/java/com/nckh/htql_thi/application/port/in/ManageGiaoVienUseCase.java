package com.nckh.htql_thi.application.port.in;

import com.nckh.htql_thi.domain.entity.GiaoVien;

import java.io.InputStream;
import java.util.List;

public interface ManageGiaoVienUseCase {

    List<GiaoVien> getAllGiaoVien();

    GiaoVien getGiaoVienById(Long id);

    GiaoVien createGiaoVien(GiaoVien giaoVien);

    GiaoVien updateGiaoVien(Long id, GiaoVien giaoVien);

    void deleteGiaoVien(Long id);

    void importExcel(InputStream inputStream);
}