import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import axiosClient from "../../api/axiosClient";
import ImportExcelBox from "../../components/ImportExcelBox";

export default function HocKyPage() {
  const [hocKyList, setHocKyList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [tenHocKy, setTenHocKy] = useState("");

  const loadHocKy = async () => {
    const res = await axiosClient.get("/api/hoc-ky");
    setHocKyList(res.data);
  };

  useEffect(() => {
    loadHocKy();
  }, []);

  const handleSubmit = async () => {
    if (!tenHocKy) return alert("⚠️ Nhập tên học kỳ!");
    if (editingId)
      await axiosClient.put(`/api/hoc-ky/${editingId}`, { tenHocKy });
    else await axiosClient.post("/api/hoc-ky", { tenHocKy });
    setEditingId(null);
    setTenHocKy("");
    loadHocKy();
  };

  return (
    <DashboardLayout>
      <h3 className="text-primary fw-bold mb-4">📅 Quản lý Học Kỳ</h3>
      <div className="row">
        <div className="col-md-5 mb-4">
          <div className="card shadow-sm p-4 border-0 border-start border-info border-4 bg-light">
            <h5 className="fw-bold mb-3">
              {editingId ? "✏️ Đổi tên học kỳ" : "➕ Thêm học kỳ mới"}
            </h5>
            <input
              className="form-control mb-3"
              placeholder="VD: Học kỳ 1 - 2025"
              value={tenHocKy}
              onChange={(e) => setTenHocKy(e.target.value)}
            />
            <button
              className="btn btn-info text-white w-100 fw-bold"
              onClick={handleSubmit}
            >
              {editingId ? "Cập nhật" : "Tạo mới"}
            </button>
          </div>
          <div className="mt-4">
            <ImportExcelBox
              endpoint="/api/hoc-ky/import-excel"
              onSuccess={loadHocKy}
            />
          </div>
        </div>
        <div className="col-md-7">
          <div className="card shadow-sm border-0">
            <div className="list-group list-group-flush">
              {hocKyList.map((hk) => (
                <div
                  key={hk.maHocKi}
                  className="list-group-item d-flex justify-content-between align-items-center py-3"
                >
                  <div>
                    <span className="badge bg-secondary me-3">
                      #{hk.maHocKi}
                    </span>
                    <span className="fw-bold fs-5">{hk.tenHocKy}</span>
                  </div>
                  <div>
                    <button
                      className="btn btn-sm btn-light border me-2"
                      onClick={() => {
                        setEditingId(hk.maHocKi);
                        setTenHocKy(hk.tenHocKy);
                      }}
                    >
                      Sửa
                    </button>
                    <button
                      className="btn btn-sm btn-danger text-white"
                      onClick={async () => {
                        if (window.confirm("Xóa?")) {
                          await axiosClient.delete(`/api/hoc-ky/${hk.maHocKi}`);
                          loadHocKy();
                        }
                      }}
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
