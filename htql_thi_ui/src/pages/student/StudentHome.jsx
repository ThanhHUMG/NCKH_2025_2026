import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import axiosClient from "../../api/axiosClient";
import {
  Calendar,
  User as UserIcon,
  Info,
  Award,
  Filter,
  BookOpen,
} from "lucide-react";

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
        const [resMe, resLich, resDiem, resHk] = await Promise.allSettled([
          axiosClient.get("/api/student/me"),
          axiosClient.get("/api/student/lich-thi"),
          axiosClient.get("/api/student/diem"),
          axiosClient.get("/api/hoc-ky"),
        ]);

        if (resMe.status === "fulfilled") setProfile(resMe.value.data);

        const loadedLich =
          resLich.status === "fulfilled" ? resLich.value.data || [] : [];
        const loadedDiem =
          resDiem.status === "fulfilled" ? resDiem.value.data || [] : [];

        setLichThiList(loadedLich);
        setDiemList(loadedDiem);

        let finalHocKis = [];

        // PHƯƠNG ÁN A: Lấy từ API thành công
        if (resHk.status === "fulfilled" && resHk.value.data?.length > 0) {
          finalHocKis = resHk.value.data;
        }
        // PHƯƠNG ÁN B: Nếu API bị chặn 403, TỰ NHẶT HỌC KỲ TỪ DỮ LIỆU ĐANG CÓ
        else {
          const hkMap = new Map();
          loadedDiem.forEach((d) => {
            if (d.lopHoc?.hocKi)
              hkMap.set(d.lopHoc.hocKi.maHocKi.toString(), d.lopHoc.hocKi);
          });
          loadedLich.forEach((lt) => {
            if (lt.hocKi) hkMap.set(lt.hocKi.maHocKi.toString(), lt.hocKi);
            if (lt.lopHoc?.hocKi)
              hkMap.set(lt.lopHoc.hocKi.maHocKi.toString(), lt.lopHoc.hocKi);
          });
          finalHocKis = Array.from(hkMap.values());
        }

        // Sắp xếp và lưu vào state
        finalHocKis.sort((a, b) => Number(a.maHocKi) - Number(b.maHocKi));
        setHocKis(finalHocKis);

        // Đặt học kỳ mặc định là kỳ mới nhất
        if (finalHocKis.length > 0) {
          setSelectedHocKi(
            finalHocKis[finalHocKis.length - 1].maHocKi.toString(),
          );
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
    ? diemList.filter((d) => {
        const hkId = d.lopHoc?.hocKi?.maHocKi || d.lopHoc?.hocKi;
        return hkId?.toString() === selectedHocKi.toString();
      })
    : diemList;

  const currentMonHocIds = filteredScores.map(
    (d) => d.lopHoc?.monHoc?.maMonHoc,
  );

  const filteredExams = selectedHocKi
    ? lichThiList.filter((lt) => {
        const hkId =
          lt.hocKi?.maHocKi ||
          lt.lopHoc?.hocKi?.maHocKi ||
          lt.hocKi ||
          lt.lopHoc?.hocKi;
        if (hkId) return hkId?.toString() === selectedHocKi.toString();
        // Cứu cánh nếu thiếu dữ liệu: dò theo môn học
        return currentMonHocIds.includes(lt.monHoc?.maMonHoc);
      })
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
            {hocKis.length === 0 && (
              <option value="">-- Chưa có dữ liệu --</option>
            )}
            {hocKis.map((hk) => (
              <option key={hk.maHocKi} value={hk.maHocKi}>
                {hk.tenHocKy}
              </option>
            ))}
          </select>
        </div>
      </div>

      {profile && (
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
      )}

      <div className="row g-4 mb-4">
        {/* LỊCH HỌC */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white">
            <h5 className="fw-bold mb-4 d-flex align-items-center gap-2 text-info">
              <BookOpen size={20} /> Lịch Học
            </h5>
            <div className="list-group list-group-flush">
              {filteredScores.length > 0 ? (
                filteredScores.map((d) => (
                  <div
                    key={`lich-hoc-${d.id}`}
                    className="list-group-item px-0 py-3 border-bottom"
                  >
                    <div className="d-flex justify-content-between mb-1">
                      <span className="fw-bold text-dark">
                        {d.lopHoc?.monHoc?.tenMonHoc}
                      </span>
                      <span className="badge bg-info bg-opacity-10 text-info px-2 py-1">
                        Nhóm {d.lopHoc?.nhom || "01"}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between small text-muted">
                      <span>
                        📍 Phòng:{" "}
                        <strong className="text-dark">
                          {d.lopHoc?.phongHoc || "Chưa xếp"}
                        </strong>
                      </span>
                      <span>
                        ⏰ {d.lopHoc?.thoiGian || "---"} (Tiết{" "}
                        {d.lopHoc?.tietBatDau || "-"})
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted py-4 small bg-light rounded-3">
                  Không có lịch học nào trong kỳ này.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* LỊCH THI */}
        <div className="col-lg-6">
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
                  Không có lịch thi nào trong kỳ này.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
        <h5 className="fw-bold mb-4 d-flex align-items-center gap-2 text-warning">
          <Award size={20} /> Kết Quả Học Tập
        </h5>
        <div className="table-responsive">
          <table className="table table-hover align-middle text-center mb-0">
            <thead className="table-light text-muted small text-uppercase">
              <tr>
                <th className="text-start">Tên Môn Học</th>
                <th>Điểm C</th>
                <th>Điểm B</th>
                <th>Điểm A</th>
                <th className="bg-light">Tổng Kết</th>
                <th>Điểm Chữ</th>
              </tr>
            </thead>
            <tbody>
              {filteredScores.length > 0 ? (
                filteredScores.map((d) => (
                  <tr key={`diem-${d.id}`}>
                    <td className="text-start fw-bold text-dark">
                      {d.lopHoc?.monHoc?.tenMonHoc}
                    </td>
                    <td>{d.diemC ?? "-"}</td>
                    <td>{d.diemB ?? "-"}</td>
                    <td className="fw-bold text-primary">{d.diemA ?? "-"}</td>
                    <td className="fw-bold bg-light fs-6 text-dark">
                      {d.diemTb ?? "-"}
                    </td>
                    <td>
                      {d.diemChu ? (
                        <span
                          className={`badge px-2 py-1 ${["A", "B", "A+", "B+"].includes(d.diemChu) ? "bg-success" : ["C", "D", "C+", "D+"].includes(d.diemChu) ? "bg-warning text-dark" : "bg-danger"}`}
                        >
                          {d.diemChu}
                        </span>
                      ) : (
                        <span className="text-muted small">Chưa có</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="py-5 text-muted small text-center bg-light rounded-3"
                  >
                    Bạn chưa có dữ liệu điểm học kỳ này.
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
