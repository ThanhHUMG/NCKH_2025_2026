import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import axiosClient from "../../api/axiosClient";
import { PenTool, Search, Save } from "lucide-react";

export default function TeacherNhapDiem() {
  const [lopHocList, setLopHocList] = useState([]);
  const [selectedLop, setSelectedLop] = useState(null);

  // State lưu trữ điểm đang nhập tạm thời { [msv]: { diemB, diemC } }
  const [draftScores, setDraftScores] = useState({});

  useEffect(() => {
    axiosClient
      .get("/api/teacher/lop-hoc")
      .then((res) => setLopHocList(res.data));
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
      // Clear draft for this student or indicate success visually
    } catch (err) {
      alert("❌ Lỗi khi lưu điểm!");
    }
  };

  return (
    <DashboardLayout>
      <h3 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2">
        <PenTool className="text-success" /> Nhập Điểm Quá Trình (B, C)
      </h3>

      <div className="card shadow-sm border-0 rounded-4 mb-4 bg-white p-4">
        <label className="form-label fw-bold text-muted small text-uppercase d-flex align-items-center gap-2">
          <Search size={18} /> Chọn lớp giảng dạy
        </label>
        <select
          className="form-select form-select-lg rounded-3 bg-light shadow-none"
          onChange={(e) => handleSelectLop(e.target.value)}
        >
          <option value="">-- Click để chọn Lớp --</option>
          {lopHocList.map((lh) => (
            <option key={lh.maLopHoc} value={lh.maLopHoc}>
              Lớp #{lh.maLopHoc} - {lh.monHoc?.tenMonHoc}
            </option>
          ))}
        </select>
      </div>

      {selectedLop && (
        <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
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
                    <td colSpan="6" className="py-5 text-muted">
                      Lớp chưa có sinh viên.
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
