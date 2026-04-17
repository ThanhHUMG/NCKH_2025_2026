import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import axiosClient from "../../api/axiosClient";
import ImportExcelBox from "../../components/ImportExcelBox";

export default function KhoaPage() {
  const [khoaList, setKhoaList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [tenKhoa, setTenKhoa] = useState("");

  const loadKhoa = async () => {
    const res = await axiosClient.get("/api/khoa");
    setKhoaList(res.data);
  };

  useEffect(() => {
    loadKhoa();
  }, []);

  const handleSubmit = async () => {
    if (!tenKhoa) return alert("⚠️ Nhập tên khoa!");
    try {
      if (editingId)
        await axiosClient.put(`/api/khoa/${editingId}`, { tenKhoa });
      else await axiosClient.post("/api/khoa", { tenKhoa });
      setEditingId(null);
      setTenKhoa("");
      loadKhoa();
    } catch (e) {
      alert("❌ Lỗi: Khoa đã tồn tại!");
    }
  };

  return (
    <DashboardLayout>
      <h3 className="text-primary fw-bold mb-4">🏛️ Quản lý Khoa</h3>
      <div className="row">
        <div className="col-md-5 mb-4">
          <div className="card shadow-sm p-4 border-0 bg-light">
            <h5 className="fw-bold mb-3">
              {editingId ? "✏️ Cập nhật Khoa" : "➕ Thêm Khoa mới"}
            </h5>
            <div className="d-flex gap-2">
              <input
                className="form-control"
                placeholder="Tên khoa (VD: CNTT)"
                value={tenKhoa}
                onChange={(e) => setTenKhoa(e.target.value)}
              />
              <button
                className="btn btn-primary fw-bold px-4"
                onClick={handleSubmit}
              >
                {editingId ? "Lưu" : "Thêm"}
              </button>
            </div>
            {editingId && (
              <button
                className="btn btn-link btn-sm mt-2 text-danger"
                onClick={() => {
                  setEditingId(null);
                  setTenKhoa("");
                }}
              >
                Hủy bỏ
              </button>
            )}
          </div>
          <div className="mt-4">
            <ImportExcelBox
              endpoint="/api/khoa/import-excel"
              onSuccess={loadKhoa}
            />
          </div>
        </div>
        <div className="col-md-7">
          <div className="card shadow-sm border-0">
            <table className="table table-hover align-middle mb-0 text-center">
              <thead className="table-dark">
                <tr>
                  <th width="100">ID</th>
                  <th className="text-start">Tên Khoa</th>
                  <th width="150">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {khoaList.map((k) => (
                  <tr key={k.maKhoa}>
                    <td className="text-muted fw-bold">#{k.maKhoa}</td>
                    <td className="text-start fw-bold text-dark">
                      {k.tenKhoa}
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-warning me-2"
                        onClick={() => {
                          setEditingId(k.maKhoa);
                          setTenKhoa(k.tenKhoa);
                        }}
                      >
                        ✏️
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={async () => {
                          if (window.confirm("Xóa khoa?")) {
                            await axiosClient.delete(`/api/khoa/${k.maKhoa}`);
                            loadKhoa();
                          }
                        }}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
