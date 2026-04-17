import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import axiosClient from "../../api/axiosClient";

export default function TeacherHome() {
  const [lopHocList, setLopHocList] = useState([]);
  const [monThiList, setMonThiList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Gọi song song 2 API: Lấy Lớp học (Môn dạy) và Môn thi (Coi thi)
    const fetchData = async () => {
      try {
        const [resLopHoc, resMonThi] = await Promise.all([
          axiosClient.get("/api/teacher/lop-hoc"),
          axiosClient.get("/api/teacher/mon-thi"),
        ]);
        setLopHocList(resLopHoc.data);
        setMonThiList(resMonThi.data);
      } catch (error) {
        console.error("Lỗi tải dữ liệu Dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center mt-5">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* ================= BẢNG 1: MÔN DẠY (LỚP HỌC) ================= */}
      <div className="card shadow-sm p-4 mb-5 border-top border-primary border-4">
        <h4 className="mb-4 text-primary">
          👨‍🏫 Danh sách Lớp / Môn phụ trách giảng dạy
        </h4>
        <div className="table-responsive">
          <table className="table table-hover border align-middle text-center">
            <thead className="table-primary text-dark">
              <tr>
                <th>Mã Lớp</th>
                <th className="text-start">Tên Môn Học</th>
                <th>Số Tín Chỉ</th>
                <th>Sĩ số Sinh viên</th>
                <th>Học kỳ</th>
              </tr>
            </thead>
            <tbody>
              {lopHocList.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-muted py-3">
                    Bạn chưa được phân công giảng dạy lớp nào.
                  </td>
                </tr>
              ) : (
                lopHocList.map((lop) => (
                  <tr key={lop.maLopHoc}>
                    <td className="fw-bold">{lop.maLopHoc}</td>
                    <td className="text-start fw-bold text-dark">
                      {lop.monHoc?.tenMonHoc}
                    </td>
                    <td>{lop.monHoc?.tinChi}</td>
                    <td>
                      <span className="badge bg-success fs-6">
                        {lop.dsSinhVien ? lop.dsSinhVien.length : 0} SV
                      </span>
                    </td>
                    <td>{lop.hocKi?.tenHocKy}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= BẢNG 2: MÔN COI THI (MÔN THI) ================= */}
      <div className="card shadow-sm p-4 border-top border-warning border-4">
        <h4 className="mb-4 text-warning text-darken">
          📝 Lịch phân công Coi thi
        </h4>
        <div className="table-responsive">
          <table className="table table-hover border align-middle text-center">
            <thead className="table-warning text-dark">
              <tr>
                <th>Mã Môn Thi</th>
                <th className="text-start">Tên Môn Thi</th>
                <th>Hình thức</th>
                <th>Phòng thi</th>
                <th>Thời gian thi</th>
              </tr>
            </thead>
            <tbody>
              {monThiList.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-muted py-3">
                    Bạn chưa có lịch coi thi nào.
                  </td>
                </tr>
              ) : (
                monThiList.map((mt) => (
                  <tr key={mt.maMonThi}>
                    <td className="fw-bold">{mt.maMonThi}</td>
                    <td className="text-start fw-bold text-dark">
                      {mt.tenMonThi}
                    </td>
                    <td>
                      <span className="badge bg-info text-dark">
                        {mt.hinhThucThi}
                      </span>
                    </td>
                    <td className="fw-bold">{mt.phongThi}</td>
                    <td className="text-danger fw-bold">
                      {mt.thoiGianThi
                        ? new Date(mt.thoiGianThi).toLocaleString("vi-VN")
                        : "Chưa xếp lịch"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
