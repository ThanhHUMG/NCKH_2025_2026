package com.nckh.htql_thi.application.service;

import com.nckh.htql_thi.application.port.in.ManageMonThiUseCase;
import com.nckh.htql_thi.application.port.out.GiaoVienPort;
import com.nckh.htql_thi.application.port.out.MonThiPort;
import com.nckh.htql_thi.domain.entity.GiaoVien;
import com.nckh.htql_thi.domain.entity.MonThi;
import org.springframework.stereotype.Service;
import com.nckh.htql_thi.domain.entity.SinhVien;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class MonThiService implements ManageMonThiUseCase {

    private final MonThiPort monThiPort;
    private final GiaoVienPort giaoVienPort;

    public MonThiService(MonThiPort monThiPort,
                         GiaoVienPort giaoVienPort) {
        this.monThiPort = monThiPort;
        this.giaoVienPort = giaoVienPort;
    }

    @Override
    public List<MonThi> getAllMonThi() {
        return monThiPort.layTatCa();
    }

    @Override
    public MonThi getMonThiById(Long id) {
        return monThiPort.timTheoId(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy môn thi ID: " + id));
    }

    @Override
    public List<MonThi> getMonThiByKiThi(Long maKiThi) {
        return monThiPort.findByKiThi(maKiThi);
    }

    @Override
    @Transactional
    public MonThi updateMonThi(Long id,
                              String hinhThucThi,
                              String phongThi,
                              LocalDateTime thoiGianThi,
                              List<Long> dsMaGiamThi) {

        MonThi monThi = monThiPort.timTheoId(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy môn thi ID: " + id));

        if (hinhThucThi == null || hinhThucThi.trim().isEmpty()) {
            throw new RuntimeException("Hình thức thi không được để trống");
        }

        if (phongThi == null || phongThi.trim().isEmpty()) {
            throw new RuntimeException("Phòng thi không được để trống");
        }

        if (thoiGianThi == null) {
            throw new RuntimeException("Thời gian thi không được để trống");
        }

        if (dsMaGiamThi == null || dsMaGiamThi.isEmpty()) {
            throw new RuntimeException("Phải chọn ít nhất 1 giám thị");
        }

        if (dsMaGiamThi.size() > 3) {
            throw new RuntimeException("Chỉ được chọn tối đa 3 giám thị");
        }

        // check trùng giám thị
        Set<Long> uniqueIds = new HashSet<>(dsMaGiamThi);
        if (uniqueIds.size() != dsMaGiamThi.size()) {
            throw new RuntimeException("Danh sách giám thị bị trùng");
        }

        List<GiaoVien> dsGiamThi = giaoVienPort.findAllByIds(dsMaGiamThi);

        if (dsGiamThi.size() != dsMaGiamThi.size()) {
            throw new RuntimeException("Có giám thị không tồn tại trong hệ thống");
        }

        monThi.setHinhThucThi(hinhThucThi.trim());
        monThi.setPhongThi(phongThi.trim());
        monThi.setThoiGianThi(thoiGianThi);
        monThi.setDsGiamThi(dsGiamThi);

        return monThiPort.luu(monThi);
    }

    @Override
    public void deleteMonThi(Long id) {
        monThiPort.xoa(id);
    }

    public List<MonThi> getMonThiChoAdminHoacTeacher(Long maGiaoVien, boolean isAdmin) {

        if (isAdmin) {
            return monThiPort.layTatCa();
        }

        return monThiPort.findByGiaoVien(maGiaoVien);
    }
    @Override
    public List<SinhVien> getSinhVienByMonThi(Long maMonThi) {

        MonThi monThi = monThiPort.timTheoId(maMonThi)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy môn thi"));

        if (monThi.getLopHoc() == null) {
            throw new RuntimeException("Môn thi này chưa được chỉ định lớp học nào!");
        }

        return monThi.getLopHoc().getDsSinhVien();
    }
}