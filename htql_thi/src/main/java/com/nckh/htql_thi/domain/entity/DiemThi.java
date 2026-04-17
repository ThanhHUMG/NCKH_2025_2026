package com.nckh.htql_thi.domain.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "diem_thi",
        uniqueConstraints = @UniqueConstraint(columnNames = {"msv", "ma_mon_thi"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DiemThi {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "msv")
    private SinhVien sinhVien;

    @ManyToOne
    @JoinColumn(name = "ma_mon_thi")
    private MonThi monThi;

    private Double diemA;
    private Double diemB;
    private Double diemC;

    private Double diemTb;
    private String diemChu;

    @PrePersist
    @PreUpdate
    public void tinhDiem() {

        if (diemA == null || diemB == null || diemC == null) {
            diemTb = null;
            diemChu = null;
            return;
        }

        double tb = 0.6 * diemA + 0.3 * diemB + 0.1 * diemC;
        tb = Math.round(tb * 100.0) / 100.0;

        diemTb = tb;

        if (diemTb < 4)
            diemChu = "F";
        else if (diemTb < 5)
            diemChu = "D";
        else if (diemTb < 5.5)
            diemChu = "D+";
        else if (diemTb < 6.5)
            diemChu = "C";
        else if (diemTb < 7)
            diemChu = "C+";
        else if (diemTb < 8)
            diemChu = "B";
        else if (diemTb < 8.5)
            diemChu = "B+";
        else if (diemTb < 9)
            diemChu = "A";
        else diemChu = "A+";
    }
}