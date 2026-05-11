import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import axiosClient from "../../api/axiosClient";
import {
  Calendar,
  User as UserIcon,
  Info,
  BookOpen,
  Award,
} from "lucide-react";

export default function StudentHome() {
  const [profile, setProfile] = useState(null);
  const [lichThiList, setLichThiList] = useState([]);
  const [diemList, setDiemList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStudentData = async () => {
      try {
        // Gọi các API chuyên biệt dành riêng cho Sinh viên đã có trong Backend
        const [resMe, resLich, resDiem] = await Promise.all([
          axiosClient.get("/api/student/me"),
          axiosClient.get("/api/student/lich-thi"),
          axiosClient.get("/api/student/diem"),
        ]);

        setProfile(resMe.data);
        setLichThiList(resLich.data);
        setDiemList(resDiem.data);
      } catch (e) {
        console.error("Lỗi tải dữ liệu sinh viên:", e);
      } finally {
        setLoading(false);
      }
    };
    loadStudentData();
  }, []);

  if (loading)
    return (
      <DashboardLayout>
        <div className="p-4">Đang tải dữ liệu sinh viên...</div>
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      <h3 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2">
        <UserIcon className="text-success" /> Cổng Thông Tin Sinh Viên
      </h3>

      {/* 1. THÔNG TIN CÁ NHÂN CHI TIẾT */}
      <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white border-start border-4 border-success">
        <h5 className="fw-bold mb-3 d-flex align-items-center gap-2 text-success">
          <Info size={20} /> Thông Tin Cá Nhân
        </h5>
        <div className="row g-3">
          <div className="col-md-4">
            <span className="text-muted small">Họ và tên:</span>{" "}
            <strong className="d-block">{profile?.hoTen}</strong>
          </div>
          <div className="col-md-4">
            <span className="text-muted small">Mã Sinh Viên:</span>{" "}
            <strong className="d-block">{profile?.msv}</strong>
          </div>
          <div className="col-md-4">
            <span className="text-muted small">Khoa:</span>{" "}
            <strong className="d-block">{profile?.khoa?.tenKhoa}</strong>
          </div>
          <div className="col-md-4">
            <span className="text-muted small">Niên khóa:</span>{" "}
            <strong className="d-block">{profile?.nienKhoa || "N/A"}</strong>
          </div>
          <div className="col-md-4">
            <span className="text-muted small">Năm sinh:</span>{" "}
            <strong className="d-block">{profile?.namSinh}</strong>
          </div>
          <div className="col-md-4">
            <span className="text-muted small">Email:</span>{" "}
            <strong className="d-block">
              {profile?.email || "Chưa cập nhật"}
            </strong>
          </div>
        </div>
      </div>

      {/* 2. LỊCH THI ĐẦY ĐỦ THÔNG TIN */}
      <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
        <h5 className="fw-bold mb-4 d-flex align-items-center gap-2 text-primary">
          <Calendar size={20} /> Lịch Thi Chi Tiết
        </h5>
        <div className="table-responsive">
          <table className="table table-hover align-middle text-center">
            <thead className="table-light text-muted small">
              <tr>
                <th>Mã Môn</th>
                <th className="text-start">Tên Môn Học</th>
                <th>Ngày Thi</th>
                <th>Tiết Bắt Đầu</th>
                <th>Phòng Thi</th>
                <th>Hình Thức</th>
              </tr>
            </thead>
            <tbody>
              {lichThiList.length > 0 ? (
                lichThiList.map((lt) => (
                  <tr key={lt.maLichThi}>
                    <td>
                      <span className="badge bg-secondary bg-opacity-10 text-secondary">
                        {lt.monHoc?.maMonHoc}
                      </span>
                    </td>
                    <td className="text-start fw-bold">
                      {lt.monHoc?.tenMonHoc}
                    </td>
                    <td className="text-danger fw-bold">{lt.thoiGian}</td>
                    <td>Tiết {lt.tietBatDau}</td>
                    <td>
                      <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-3">
                        {lt.phongThi}
                      </span>
                    </td>
                    <td>
                      <small className="fw-bold text-muted">
                        {lt.hinhThucThi}
                      </small>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-4 text-muted small">
                    Chưa có lịch thi nào được công bố.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. KẾT QUẢ HỌC TẬP (ĐIỂM SỐ) */}
      <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
        <h5 className="fw-bold mb-4 d-flex align-items-center gap-2 text-warning">
          <Award size={20} /> Kết Quả Học Tập
        </h5>
        <div className="table-responsive">
          <table className="table table-bordered align-middle text-center">
            <thead className="table-light text-muted small">
              <tr>
                <th className="text-start">Tên Môn Học</th>
                <th>Điểm A (60%)</th>
                <th>Điểm B (30%)</th>
                <th>Điểm C (10%)</th>
                <th>Tổng Kết</th>
                <th>Điểm Chữ</th>
              </tr>
            </thead>
            <tbody>
              {diemList.length > 0 ? (
                diemList.map((d) => (
                  <tr key={d.id}>
                    <td className="text-start fw-bold">
                      {d.lopHoc?.monHoc?.tenMonHoc}
                    </td>
                    <td className="fw-bold text-primary">{d.diemA ?? "-"}</td>
                    <td>{d.diemB ?? "-"}</td>
                    <td>{d.diemC ?? "-"}</td>
                    <td className="fw-bold bg-light">{d.diemTb ?? "-"}</td>
                    <td>
                      <span
                        className={`badge ${d.diemTb >= 4 ? "bg-success" : "bg-danger"} px-3`}
                      >
                        {d.diemChu || "N/A"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-4 text-muted small">
                    Dữ liệu điểm số đang được cập nhật.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
