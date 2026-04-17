import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import axiosClient from "../../api/axiosClient";

export default function StudentHome() {
  const [me, setMe] = useState(null);
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resMe, resScores] = await Promise.all([
          axiosClient.get("/api/student/me"),
          axiosClient.get("/api/student/diem"),
        ]);
        setMe(resMe.data);
        setScores(resScores.data);
      } catch (error) {
        console.error("Lỗi lấy dữ liệu sinh viên:", error);
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
      {/* ================= THÔNG TIN CÁ NHÂN ================= */}
      {me && (
        <div className="card shadow-sm p-4 mb-4 border-top border-info border-4">
          <h4 className="mb-4 text-info text-darken">👤 Thông tin cá nhân</h4>
          <div className="row">
            <div className="col-md-6">
              <table className="table table-borderless">
                <tbody>
                  <tr>
                    <th style={{ width: "150px" }}>Mã sinh viên:</th>
                    <td className="fw-bold">{me.msv}</td>
                  </tr>
                  <tr>
                    <th>Họ và tên:</th>
                    <td className="fw-bold text-primary">{me.hoTen}</td>
                  </tr>
                  <tr>
                    <th>Năm sinh:</th>
                    <td>{me.namSinh}</td>
                  </tr>
                  <tr>
                    <th>Khóa / Niên khóa:</th>
                    <td>{me.nienKhoa || "Chưa cập nhật"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="col-md-6">
              <table className="table table-borderless">
                <tbody>
                  <tr>
                    <th style={{ width: "150px" }}>Khoa:</th>
                    {/* 👇 CHỖ ĐÃ FIX LỖI SẬP WEB 👇 */}
                    <td className="fw-bold">
                      {me.khoa?.tenKhoa || "Chưa cập nhật"}
                    </td>
                  </tr>
                  <tr>
                    <th>Email:</th>
                    <td>{me.email || "Chưa cập nhật"}</td>
                  </tr>
                  <tr>
                    <th>Số điện thoại:</th>
                    <td>{me.soDienThoai || "Chưa cập nhật"}</td>
                  </tr>
                  <tr>
                    <th>Địa chỉ:</th>
                    <td>{me.diaChi || "Chưa cập nhật"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= BẢNG ĐIỂM ================= */}
      <div className="card shadow-sm p-4 border-top border-primary border-4">
        <h4 className="mb-4 text-primary">🎓 Bảng điểm của tôi</h4>

        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle text-center">
            <thead className="table-primary text-dark">
              <tr>
                <th className="text-start">Môn thi</th>
                <th title="Trọng số 60%">Cuối kỳ (A)</th>
                <th title="Trọng số 30%">Giữa kỳ (B)</th>
                <th title="Trọng số 10%">Chuyên cần (C)</th>
                <th>Điểm TB (Hệ 10)</th>
                <th>Điểm chữ</th>
              </tr>
            </thead>
            <tbody>
              {scores.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-muted py-3">
                    Bạn chưa có điểm môn nào.
                  </td>
                </tr>
              ) : (
                scores.map((d) => (
                  <tr key={d.id}>
                    <td className="text-start fw-bold">
                      {d.monThi?.tenMonThi}
                    </td>
                    <td className="text-primary fw-bold">{d.diemA ?? "-"}</td>
                    <td className="text-primary fw-bold">{d.diemB ?? "-"}</td>
                    <td className="text-primary fw-bold">{d.diemC ?? "-"}</td>
                    <td className="text-danger fw-bold">{d.diemTb ?? "-"}</td>
                    <td className="text-danger fw-bold fs-5">
                      {d.diemChu ?? "-"}
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
