package com.nckh.htql_thi.application.port.in;

import com.nckh.htql_thi.application.dto.ThongKeLopHocDTO;
import java.io.InputStream;
import org.springframework.web.multipart.MultipartFile;

public interface ManageDiemThiUseCase {
    void importDiemAExcel(Long maLopHoc, InputStream inputStream);
    void importDiemTuExcel(MultipartFile file);
    ThongKeLopHocDTO thongKeTheoLop(Long maLopHoc);
}