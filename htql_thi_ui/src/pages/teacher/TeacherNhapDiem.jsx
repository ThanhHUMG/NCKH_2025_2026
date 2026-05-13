import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import axiosClient from "../../api/axiosClient";
import { PenTool, Search, Save, FileUp, Info } from "lucide-react";

export default function TeacherNhapDiem() {
  const [lopHocList, setLopHocList] = useState([]);
  const [selectedLop, setSelectedLop] = useState(null);

  // State lưu trữ điểm đang nhập tạm thời { [msv]: { diemB, diemC } }
  const [draftScores, setDraftScores] = useState({});

  // State xử lý loading khi upload file
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    axiosClient
      .get("/api/teacher/lop-hoc")
      .then((res) => setLopHocList(res.data))
      .catch((err) => console.error("Lỗi tải danh sách lớp:", err));
  }, []);

  const handleSelectLop = (maLop) => {
    if (!maLop) {
      setSelectedLop(null);
      setDraftScores({});
      return;
    }
    const lh = lopHocList.find((m) => m.maLopHoc === Number(maLop));
    setSelectedLop(lh);

    // Khởi tạo state nhập liệu
    const initialScores = {};
    lh.dsSinhVien?.forEach((sv) => {
      initialScores[sv.msv] = { diemB: "", diemC: "" };
    });
    setDraftScores(initialScores);
  };

  const handleScoreChange = (msv, field, value) => {
    setDraftScores((prev) => ({
      ...prev,
      [msv]: { ...prev[msv], [field]: value },
    }));
  };

  // 1. LƯU ĐIỂM THỦ CÔNG (TỪNG SINH VIÊN)
  const handleSaveScore = async (sv) => {
    const diemB = parseFloat(draftScores[sv.msv]?.diemB);
    const diemC = parseFloat(draftScores[sv.msv]?.diemC);

    if (
      isNaN(diemB) ||
      isNaN(diemC) ||
      diemB < 0 ||
      diemB > 10 ||
      diemC < 0 ||
      diemC > 10
    ) {
      return alert("❌ Lỗi: Điểm phải là số hợp lệ từ 0 đến 10!");
    }

    try {
      await axiosClient.post(
        `/api/teacher/lop-hoc/${selectedLop.maLopHoc}/nhap-diem-bc`,
        {
          msv: sv.msv,
          diemB: diemB,
          diemC: diemC,
        },
      );
      alert(`✅ Đã lưu điểm cho sinh viên ${sv.hoTen}`);
    } catch (err) {
      alert("❌ Lỗi khi lưu điểm!");
    }
  };

  // 2. LƯU ĐIỂM HÀNG LOẠT BẰNG EXCEL
  const handleImportExcel = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Kiểm tra định dạng file
    if (!file.name.match(/\.(xlsx|xls)$/)) {
      alert("❌ Vui lòng chọn file Excel (.xlsx hoặc .xls)");
      e.target.value = null; // Reset input
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    try {
      // Gọi API mới tạo bên DiemThiController
      await axiosClient.post("/api/diem-thi/import-diem-thanh-phan", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("✅ Hệ thống đã đọc file và cập nhật điểm B, C thành công!");
      e.target.value = null; // Reset ô chọn file
      // Tải lại trang để đồng bộ dữ liệu mới nhất (nếu cần)
      window.location.reload();
    } catch (error) {
      alert("❌ Lỗi Import: " + (error.response?.data || error.message));
      e.target.value = null;
    } finally {
      setUploading(false);
    }
  };

  return (
    <DashboardLayout>
      <h3 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2">
        <PenTool className="text-success" /> Nhập Điểm Quá Trình (B, C)
      </h3>

      {/* KHU VỰC CÔNG CỤ: CHỌN LỚP HOẶC IMPORT EXCEL */}
      <div className="card shadow-sm border-0 rounded-4 mb-4 bg-white p-4">
        <div className="row align-items-end g-3">
          <div className="col-md-8">
            <label className="form-label fw-bold text-muted small text-uppercase d-flex align-items-center gap-2">
              <Search size={18} /> Chọn lớp để nhập tay
            </label>
            <select
              className="form-select form-select-lg rounded-3 bg-light shadow-none border-0"
              onChange={(e) => handleSelectLop(e.target.value)}
            >
              <option value="">-- Click để chọn Lớp --</option>
              {lopHocList.map((lh) => (
                <option key={lh.maLopHoc} value={lh.maLopHoc}>
                  Lớp #{lh.maLopHoc} - {lh.monHoc?.tenMonHoc} (Nhóm{" "}
                  {lh.nhom || "01"})
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4 text-md-end">
            <label
              className={`btn btn-success btn-lg rounded-3 shadow-sm w-100 d-flex align-items-center justify-content-center gap-2 mb-0 ${uploading ? "disabled" : ""}`}
            >
              {uploading ? (
                <span
                  className="spinner-border spinner-border-sm"
                  aria-hidden="true"
                ></span>
              ) : (
                <FileUp size={20} />
              )}
              {uploading ? "Đang xử lý..." : "Nhập nhanh bằng Excel"}
              <input
                type="file"
                className="d-none"
                accept=".xlsx, .xls"
                onChange={handleImportExcel}
                disabled={uploading}
              />
            </label>
          </div>
        </div>

        {/* Chú thích cấu trúc file Excel */}
        <div className="mt-3 text-muted small d-flex align-items-start gap-1 bg-light p-2 rounded border border-dashed">
          <Info size={16} className="text-primary mt-1 flex-shrink-0" />
          <span>
            <strong>Lưu ý Import:</strong> File Excel cần có cấu trúc các cột:{" "}
            <em>
              (0) STT, (1) Mã SV, (2) Họ tên, (3) Mã môn, (4) Tên môn, (5) Điểm
              B, (6) Điểm C
            </em>
            . Hệ thống sẽ tự động phân bổ điểm vào đúng lớp của bạn.
          </span>
        </div>
      </div>

      {/* BẢNG NHẬP ĐIỂM THỦ CÔNG */}
      {selectedLop && (
        <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
          <div className="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
            <h6 className="mb-0 fw-bold text-primary">
              Danh sách sinh viên lớp: {selectedLop.monHoc?.tenMonHoc}
            </h6>
            <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill">
              Sĩ số: {selectedLop.dsSinhVien?.length || 0}
            </span>
          </div>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 text-center">
              <thead className="table-light text-muted small text-uppercase">
                <tr>
                  <th className="py-3">MSV</th>
                  <th className="text-start py-3">Họ tên</th>
                  <th className="py-3 text-secondary">Điểm Cuối Kỳ (A)</th>
                  <th className="py-3 text-primary" style={{ width: "150px" }}>
                    Điểm Giữa Kỳ (B)
                  </th>
                  <th className="py-3 text-primary" style={{ width: "150px" }}>
                    Chuyên Cần (C)
                  </th>
                  <th className="py-3">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {selectedLop.dsSinhVien?.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-5 text-muted bg-light">
                      Lớp chưa có sinh viên nào.
                    </td>
                  </tr>
                ) : (
                  selectedLop.dsSinhVien?.map((sv) => (
                    <tr key={sv.msv}>
                      <td className="fw-bold text-secondary">#{sv.msv}</td>
                      <td className="text-start fw-bold text-dark">
                        {sv.hoTen}
                      </td>
                      <td className="text-muted">
                        <span className="badge bg-light text-muted border">
                          🔒 P. Đào Tạo Nhập
                        </span>
                      </td>
                      <td>
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="10"
                          className="form-control form-control-sm text-center fw-bold text-primary"
                          placeholder="0 - 10"
                          value={draftScores[sv.msv]?.diemB}
                          onChange={(e) =>
                            handleScoreChange(sv.msv, "diemB", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="10"
                          className="form-control form-control-sm text-center fw-bold text-primary"
                          placeholder="0 - 10"
                          value={draftScores[sv.msv]?.diemC}
                          onChange={(e) =>
                            handleScoreChange(sv.msv, "diemC", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-success rounded-3 px-3 shadow-sm fw-medium d-flex align-items-center gap-1 mx-auto"
                          onClick={() => handleSaveScore(sv)}
                        >
                          <Save size={16} /> Lưu
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
