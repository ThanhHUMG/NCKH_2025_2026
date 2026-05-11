package com.nckh.htql_thi.domain.entity;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DiemThi {
    private Long id;
    private SinhVien sinhVien;
    private LopHoc lopHoc; // Chuyển từ tham chiếu MonThi sang LopHoc
    
    private Double diemA;
    private Double diemB;
    private Double diemC;

    private Double diemTb;
    private String diemChu;

    // Business Rule (Quy tắc nghiệp vụ) nằm hoàn toàn ở Domain
    public void tinhDiem() {
        if (diemA == null || diemB == null || diemC == null) {
            this.diemTb = null;
            this.diemChu = null;
            return;
        }

        double tb = 0.6 * diemA + 0.3 * diemB + 0.1 * diemC;
        this.diemTb = Math.round(tb * 100.0) / 100.0;

        if (diemTb < 4) diemChu = "F";
        else if (diemTb < 5) diemChu = "D";
        else if (diemTb < 5.5) diemChu = "D+";
        else if (diemTb < 6.5) diemChu = "C";
        else if (diemTb < 7) diemChu = "C+";
        else if (diemTb < 8) diemChu = "B";
        else if (diemTb < 8.5) diemChu = "B+";
        else if (diemTb < 9) diemChu = "A";
        else diemChu = "A+";
    }
}