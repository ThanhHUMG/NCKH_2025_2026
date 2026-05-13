import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import axiosClient from "../../api/axiosClient";
import { Calendar, User as UserIcon, Info, Award, Filter } from "lucide-react";

export default function StudentHome() {
  const [profile, setProfile] = useState(null);
  const [lichThiList, setLichThiList] = useState([]);
  const [diemList, setDiemList] = useState([]);

  const [hocKis, setHocKis] = useState([]);
  const [selectedHocKi, setSelectedHocKi] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStudentData = async () => {
      try {
        // Dùng allSettled: Lỗi 1 API thì các API khác vẫn chạy bình thường (Bảo vệ thông tin cá nhân)
        const [resMe, resLich, resDiem] = await Promise.allSettled([
          axiosClient.get("/api/student/me"),
          axiosClient.get("/api/student/lich-thi"),
          axiosClient.get("/api/student/diem"),
        ]);

        let loadedDiem = [];
        if (resMe.status === "fulfilled") setProfile(resMe.value.data);
        if (resLich.status === "fulfilled")
          setLichThiList(resLich.value.data || []);

        if (resDiem.status === "fulfilled") {
          loadedDiem = resDiem.value.data || [];
          setDiemList(loadedDiem);
        }

        // TRÍCH XUẤT HỌC KỲ THÔNG MINH TỪ DANH SÁCH MÔN HỌC
        // Không cần gọi API /api/hoc-ky để tránh lỗi quyền
        if (loadedDiem.length > 0) {
          const hkMap = new Map();
          loadedDiem.forEach((d) => {
            if (d.lopHoc?.hocKi) {
              hkMap.set(d.lopHoc.hocKi.maHocKi.toString(), d.lopHoc.hocKi);
            }
          });

          const extractedHocKis = Array.from(hkMap.values());
          // Sắp xếp học kỳ tăng dần
          extractedHocKis.sort((a, b) => a.maHocKi - b.maHocKi);
          setHocKis(extractedHocKis);

          // Tự động chọn học kỳ mới nhất
          if (extractedHocKis.length > 0) {
            setSelectedHocKi(
              extractedHocKis[extractedHocKis.length - 1].maHocKi.toString(),
            );
          }
        }
      } catch (e) {
        console.error("Lỗi tải dữ liệu:", e);
      } finally {
        setLoading(false);
      }
    };
    loadStudentData();
  }, []);

  // --- LOGIC LỌC DỮ LIỆU ---
  const filteredScores = selectedHocKi
    ? diemList.filter(
        (d) => d.lopHoc?.hocKi?.maHocKi?.toString() === selectedHocKi,
      )
    : diemList;

  const currentMonHocIds = filteredScores.map(
    (d) => d.lopHoc?.monHoc?.maMonHoc,
  );

  const filteredExams = selectedHocKi
    ? lichThiList.filter((lt) => currentMonHocIds.includes(lt.monHoc?.maMonHoc))
    : lichThiList;
  // -------------------------

  if (loading)
    return (
      <DashboardLayout>
        <div className="text-center mt-5">
          <div className="spinner-border text-success"></div>
        </div>
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
          <UserIcon className="text-success" /> Cổng Thông Tin Sinh Viên
        </h3>

        {/* BỘ LỌC HỌC KỲ */}
        <div className="d-flex align-items-center gap-2 bg-white px-3 py-2 rounded-pill shadow-sm border">
          <Filter size={18} className="text-muted" />
          <span className="fw-medium text-muted small whitespace-nowrap">
            Học kỳ:
          </span>
          <select
            className="form-select form-select-sm border-0 fw-bold text-success shadow-none cursor-pointer"
            style={{ width: "auto", minWidth: "150px" }}
            value={selectedHocKi}
            onChange={(e) => setSelectedHocKi(e.target.value)}
          >
            <option value="">-- Tất cả học kỳ --</option>
            {hocKis.map((hk) => (
              <option key={hk.maHocKi} value={hk.maHocKi}>
                {hk.tenHocKy}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 1. THÔNG TIN CÁ NHÂN LUÔN HIỆN */}
      {profile ? (
        <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white border-start border-4 border-success">
          <h5 className="fw-bold mb-3 d-flex align-items-center gap-2 text-success">
            <Info size={20} /> Thông Tin Cá Nhân
          </h5>
          <div className="row g-3">
            <div className="col-md-4">
              <span className="text-muted small">Họ và tên:</span>{" "}
              <strong className="d-block text-dark">{profile.hoTen}</strong>
            </div>
            <div className="col-md-4">
              <span className="text-muted small">Mã Sinh Viên:</span>{" "}
              <strong className="d-block text-dark">{profile.msv}</strong>
            </div>
            <div className="col-md-4">
              <span className="text-muted small">Khoa:</span>{" "}
              <strong className="d-block text-dark">
                {profile.khoa?.tenKhoa}
              </strong>
            </div>
            <div className="col-md-4">
              <span className="text-muted small">Niên khóa:</span>{" "}
              <strong className="d-block text-dark">
                {profile.nienKhoa || "N/A"}
              </strong>
            </div>
            <div className="col-md-4">
              <span className="text-muted small">Năm sinh:</span>{" "}
              <strong className="d-block text-dark">{profile.namSinh}</strong>
            </div>
            <div className="col-md-4">
              <span className="text-muted small">Email:</span>{" "}
              <strong className="d-block text-dark">
                {profile.email || "Chưa cập nhật"}
              </strong>
            </div>
          </div>
        </div>
      ) : (
        <div className="alert alert-warning rounded-4 shadow-sm">
          ⚠️ Không thể tải thông tin cá nhân.
        </div>
      )}

      <div className="row g-4">
        {/* 2. LỊCH THI */}
        <div className="col-lg-5">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white">
            <h5 className="fw-bold mb-4 d-flex align-items-center gap-2 text-primary">
              <Calendar size={20} /> Lịch Thi
            </h5>
            <div className="list-group list-group-flush">
              {filteredExams.length > 0 ? (
                filteredExams.map((lt) => (
                  <div
                    key={lt.maLichThi}
                    className="list-group-item px-0 py-3 border-bottom"
                  >
                    <div className="d-flex justify-content-between mb-1">
                      <span className="fw-bold text-dark">
                        {lt.monHoc?.tenMonHoc}
                      </span>
                      <span className="badge bg-primary bg-opacity-10 text-primary px-2 py-1">
                        {lt.phongThi}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between small text-muted">
                      <span>
                        <span className="text-danger fw-bold">
                          {lt.thoiGian}
                        </span>{" "}
                        (Tiết {lt.tietBatDau})
                      </span>
                      <span>{lt.hinhThucThi}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted py-4 small bg-light rounded-3">
                  Không có lịch thi nào trong học kỳ này.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 3. ĐIỂM SỐ & LỊCH HỌC */}
        <div className="col-lg-7">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white">
            <h5 className="fw-bold mb-4 d-flex align-items-center gap-2 text-warning">
              <Award size={20} /> Điểm Số & Lịch Học
            </h5>
            <div className="table-responsive">
              <table className="table table-hover align-middle text-center mb-0">
                <thead className="table-light text-muted small text-uppercase">
                  <tr>
                    <th className="text-start">Môn / Nhóm</th>
                    <th>Điểm A</th>
                    <th>Điểm B</th>
                    <th>Điểm C</th>
                    <th className="bg-light">T.Kết</th>
                    <th>Chữ</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredScores.length > 0 ? (
                    filteredScores.map((d) => (
                      <tr key={d.id}>
                        <td className="text-start">
                          <div className="fw-bold text-dark">
                            {d.lopHoc?.monHoc?.tenMonHoc}
                          </div>
                          <div className="small text-muted mt-1">
                            Phòng: {d.lopHoc?.phongHoc || "N/A"}
                          </div>
                        </td>
                        <td className="fw-bold text-primary">
                          {d.diemA ?? "-"}
                        </td>
                        <td>{d.diemB ?? "-"}</td>
                        <td>{d.diemC ?? "-"}</td>
                        <td className="fw-bold bg-light fs-6 text-dark">
                          {d.diemTb ?? "-"}
                        </td>
                        <td>
                          {d.diemChu ? (
                            <span
                              className={`badge px-2 py-1 ${["A", "B"].includes(d.diemChu) ? "bg-success" : ["C", "D"].includes(d.diemChu) ? "bg-warning text-dark" : "bg-danger"}`}
                            >
                              {d.diemChu}
                            </span>
                          ) : (
                            <span className="text-muted small">N/A</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="py-4 text-muted small text-center bg-light rounded-3"
                      >
                        Bạn chưa có dữ liệu điểm học kỳ này.
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
