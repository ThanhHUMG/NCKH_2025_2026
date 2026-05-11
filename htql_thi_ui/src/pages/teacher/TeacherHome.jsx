import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import axiosClient from "../../api/axiosClient";
import { Calendar, User as UserIcon, BookOpen, Briefcase } from "lucide-react";

export default function TeacherHome() {
  const [profile, setProfile] = useState(null);
  const [dsLopHoc, setDsLopHoc] = useState([]);
  const [dsLichCoiThi, setDsLichCoiThi] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTeacherData = async () => {
      try {
        // Sử dụng các API chuyên biệt đã có sẵn ở Backend của bạn
        const [resMe, resLop, resLich] = await Promise.all([
          axiosClient.get("/api/teacher/me"),
          axiosClient.get("/api/teacher/lop-hoc"),
          axiosClient.get("/api/teacher/lich-thi"),
        ]);
        setProfile(resMe.data);
        setDsLopHoc(resLop.data);
        setDsLichCoiThi(resLich.data);
      } catch (e) {
        console.error("Lỗi tải dữ liệu giáo viên:", e);
      } finally {
        setLoading(false);
      }
    };
    loadTeacherData();
  }, []);

  return (
    <DashboardLayout>
      <h3 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2">
        <Briefcase className="text-primary" /> Trang Chủ Giảng Viên
      </h3>

      {/* 1. THÔNG TIN CÁ NHÂN CÁN BỘ */}
      <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white border-start border-4 border-primary">
        <h5 className="fw-bold mb-3 text-primary">Thông tin cán bộ</h5>
        <div className="row g-3">
          <div className="col-md-4">
            <span className="text-muted small">Họ và tên:</span>{" "}
            <strong className="d-block">{profile?.hoTen}</strong>
          </div>
          <div className="col-md-4">
            <span className="text-muted small">Mã cán bộ:</span>{" "}
            <strong className="d-block">{profile?.maGiaoVien}</strong>
          </div>
          <div className="col-md-4">
            <span className="text-muted small">Khoa:</span>{" "}
            <strong className="d-block">{profile?.khoa?.tenKhoa}</strong>
          </div>
          <div className="col-md-4">
            <span className="text-muted small">Trình độ:</span>{" "}
            <strong className="d-block">{profile?.trinhDo || "N/A"}</strong>
          </div>
          <div className="col-md-4">
            <span className="text-muted small">Email:</span>{" "}
            <strong className="d-block">{profile?.email}</strong>
          </div>
          <div className="col-md-4">
            <span className="text-muted small">Số điện thoại:</span>{" "}
            <strong className="d-block">{profile?.soDienThoai}</strong>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* 2. DANH SÁCH LỚP ĐANG DẠY */}
        <div className="col-xl-6">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white">
            <h5 className="fw-bold mb-4 d-flex align-items-center gap-2 text-success">
              <BookOpen size={20} /> Lớp Học Đang Giảng Dạy
            </h5>
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light small">
                  <tr>
                    <th>Mã Lớp</th>
                    <th>Tên Môn Học</th>
                    <th>Học Kỳ</th>
                    <th>Sĩ Số</th>
                  </tr>
                </thead>
                <tbody>
                  {dsLopHoc.map((lop) => (
                    <tr key={lop.maLopHoc}>
                      <td>#{lop.maLopHoc}</td>
                      <td className="fw-bold">{lop.monHoc?.tenMonHoc}</td>
                      <td>{lop.hocKi?.tenHocKy}</td>
                      <td>{lop.dsSinhVien?.length || 0} SV</td>
                    </tr>
                  ))}
                  {dsLopHoc.length === 0 && (
                    <tr>
                      <td
                        colSpan="4"
                        className="text-center py-3 text-muted small"
                      >
                        Chưa có dữ liệu lớp dạy.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 3. LỊCH PHÂN CÔNG COI THI */}
        <div className="col-xl-6">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white">
            <h5 className="fw-bold mb-4 d-flex align-items-center gap-2 text-warning">
              <Calendar size={20} /> Lịch Phân Công Coi Thi
            </h5>
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light small">
                  <tr>
                    <th>Môn Thi</th>
                    <th>Phòng</th>
                    <th>Thời Gian</th>
                  </tr>
                </thead>
                <tbody>
                  {dsLichCoiThi.map((lt) => (
                    <tr key={lt.maLichThi}>
                      <td>
                        <div className="fw-bold">{lt.monHoc?.tenMonHoc}</div>
                        <small className="text-muted">{lt.hinhThucThi}</small>
                      </td>
                      <td>
                        <span className="badge bg-light text-dark border">
                          {lt.phongThi}
                        </span>
                      </td>
                      <td>
                        <span className="text-danger fw-bold">
                          {lt.thoiGian}
                        </span>{" "}
                        <br />
                        <small className="text-muted">
                          Tiết bắt đầu: {lt.tietBatDau}
                        </small>
                      </td>
                    </tr>
                  ))}
                  {dsLichCoiThi.length === 0 && (
                    <tr>
                      <td
                        colSpan="3"
                        className="text-center py-3 text-muted small"
                      >
                        Chưa có lịch coi thi.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
