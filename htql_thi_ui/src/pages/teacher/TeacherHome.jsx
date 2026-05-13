import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import axiosClient from "../../api/axiosClient";
import { BookOpen, CalendarDays, UserCircle, Filter } from "lucide-react";

export default function TeacherHome() {
  const [me, setMe] = useState(null);
  const [lopHocs, setLopHocs] = useState([]);
  const [lichThis, setLichThis] = useState([]);
  const [hocKis, setHocKis] = useState([]); // Danh sách học kỳ trích xuất được
  const [selectedHocKi, setSelectedHocKi] = useState(""); // Học kỳ đang chọn
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Sử dụng Promise.allSettled để bảo vệ trang web khỏi lỗi 403 hoặc 404
        const [resMe, resLop, resLich] = await Promise.allSettled([
          axiosClient.get("/api/teacher/me"),
          axiosClient.get("/api/teacher/lop-hoc"),
          axiosClient.get("/api/teacher/lich-thi"),
        ]);

        if (resMe.status === "fulfilled") setMe(resMe.value.data);
        if (resLich.status === "fulfilled")
          setLichThis(resLich.value.data || []);

        let loadedLop = [];
        if (resLop.status === "fulfilled") {
          loadedLop = resLop.value.data || [];
          setLopHocs(loadedLop);
        }

        // --- TRÍCH XUẤT HỌC KỲ TỪ DANH SÁCH LỚP ĐANG DẠY ---
        if (loadedLop.length > 0) {
          const hkMap = new Map();
          loadedLop.forEach((l) => {
            if (l.hocKi) {
              hkMap.set(l.hocKi.maHocKi.toString(), l.hocKi);
            }
          });

          const extractedHocKis = Array.from(hkMap.values());
          // Sắp xếp học kỳ mới nhất lên đầu (hoặc cuối tùy bạn)
          extractedHocKis.sort((a, b) => b.maHocKi - a.maHocKi);
          setHocKis(extractedHocKis);

          // Mặc định chọn học kỳ đầu tiên trong danh sách đã sắp xếp
          if (extractedHocKis.length > 0) {
            setSelectedHocKi(extractedHocKis[0].maHocKi.toString());
          }
        }
      } catch (error) {
        console.error("Lỗi hệ thống:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- LOGIC LỌC DỮ LIỆU TẠI FRONTEND ---
  const filteredLopHocs = selectedHocKi
    ? lopHocs.filter((l) => l.hocKi?.maHocKi?.toString() === selectedHocKi)
    : lopHocs;

  // Lọc lịch coi thi dựa trên các môn học thuộc học kỳ đang chọn
  const currentMonHocIds = filteredLopHocs.map((l) => l.monHoc?.maMonHoc);
  const filteredExams = selectedHocKi
    ? lichThis.filter((lt) => currentMonHocIds.includes(lt.monHoc?.maMonHoc))
    : lichThis;
  // --------------------------------------

  if (loading)
    return (
      <DashboardLayout>
        <div className="text-center mt-5">
          <div className="spinner-border text-primary"></div>
          <p className="mt-2 text-muted">Đang tải dữ liệu giảng viên...</p>
        </div>
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold text-dark mb-0">
          👨‍🏫 Bảng Điều Khiển Giảng Viên
        </h3>

        {/* BỘ LỌC HỌC KỲ THÔNG MINH */}
        <div className="d-flex align-items-center gap-2 bg-white px-3 py-2 rounded-pill shadow-sm border">
          <Filter size={18} className="text-primary" />
          <span className="fw-medium text-muted small">Học kỳ:</span>
          <select
            className="form-select form-select-sm border-0 fw-bold text-primary shadow-none cursor-pointer"
            style={{ width: "auto", minWidth: "160px" }}
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

      {me ? (
        <div className="card shadow-sm border-0 rounded-4 mb-4 bg-white border-start border-info border-4">
          <div className="card-body p-4">
            <h5 className="fw-bold text-info mb-4 d-flex align-items-center gap-2">
              <UserCircle size={22} /> Hồ sơ Giảng viên
            </h5>
            <div className="row g-4">
              <div className="col-md-6">
                <table className="table table-borderless mb-0">
                  <tbody>
                    <tr>
                      <th className="text-muted w-25">Mã GV:</th>
                      <td className="fw-bold">#{me.maGiaoVien}</td>
                    </tr>
                    <tr>
                      <th className="text-muted">Họ tên:</th>
                      <td className="fw-bold text-primary">{me.hoTen}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="col-md-6">
                <table className="table table-borderless mb-0">
                  <tbody>
                    <tr>
                      <th className="text-muted w-25">Khoa:</th>
                      <td>{me.khoa?.tenKhoa}</td>
                    </tr>
                    <tr>
                      <th className="text-muted">Trình độ:</th>
                      <td>{me.trinhDo}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="alert alert-warning rounded-4 shadow-sm">
          ⚠️ Không thể tải thông tin hồ sơ giảng viên.
        </div>
      )}

      <div className="row g-4">
        {/* DANH SÁCH LỚP HỌC (ĐÃ LỌC) */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm rounded-4 h-100 bg-white">
            <div className="card-body p-4">
              <h5 className="fw-bold text-primary mb-3 d-flex align-items-center gap-2">
                <BookOpen size={20} /> Lớp Đang Giảng Dạy
              </h5>
              <div className="list-group list-group-flush">
                {filteredLopHocs.length > 0 ? (
                  filteredLopHocs.map((l) => (
                    <div
                      key={l.maLopHoc}
                      className="list-group-item px-0 py-3 d-flex justify-content-between align-items-center border-bottom"
                    >
                      <div>
                        <div className="fw-bold text-dark mb-1">
                          {l.monHoc?.tenMonHoc}{" "}
                          <span className="text-primary ms-1">
                            - Nhóm {l.nhom || "01"}
                          </span>
                        </div>
                        <div className="small text-muted d-flex flex-column gap-1">
                          <span>
                            📍 Phòng:{" "}
                            <strong>{l.phongHoc || "Chưa xếp"}</strong>
                          </span>
                          <span>
                            ⏰ {l.thoiGian || "---"} (Tiết {l.tietBatDau || "-"}
                            )
                          </span>
                        </div>
                      </div>
                      <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3 py-2">
                        {l.dsSinhVien?.length || 0} SV
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-5 text-muted small bg-light rounded-3">
                    Không có lớp học nào trong học kỳ này.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* LỊCH COI THI (ĐÃ LỌC) */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm rounded-4 h-100 bg-white">
            <div className="card-body p-4">
              <h5 className="fw-bold text-warning mb-3 d-flex align-items-center gap-2">
                <CalendarDays size={20} /> Lịch Coi Thi
              </h5>
              <div className="list-group list-group-flush">
                {filteredExams.length > 0 ? (
                  filteredExams.map((lt) => (
                    <div
                      key={lt.maLichThi}
                      className="list-group-item px-0 py-3 border-bottom"
                    >
                      <div className="d-flex justify-content-between">
                        <span className="fw-bold text-dark">
                          {lt.monHoc?.tenMonHoc}
                        </span>
                        <span className="badge bg-danger bg-opacity-10 text-danger px-2 py-1">
                          {lt.phongThi}
                        </span>
                      </div>
                      <div className="d-flex justify-content-between mt-1 small">
                        <span className="text-muted">
                          Ngày:{" "}
                          <strong className="text-dark">{lt.thoiGian}</strong> -
                          Tiết {lt.tietBatDau}
                        </span>
                        <span className="text-muted italic">
                          {lt.hinhThucThi}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-5 text-muted small bg-light rounded-3">
                    Không có lịch coi thi trong học kỳ này.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
