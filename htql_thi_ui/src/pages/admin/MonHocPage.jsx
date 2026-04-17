import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import axiosClient from "../../api/axiosClient";

export default function MonHocPage() {
  const [monHocList, setMonHocList] = useState([]);
  const [khoaList, setKhoaList] = useState([]);
  const [form, setForm] = useState({ tenMonHoc: "", tinChi: "", maKhoa: "" });
  const [editingId, setEditingId] = useState(null);
  const [excelFile, setExcelFile] = useState(null);

  const loadData = async () => {
    try {
      const [mh, k] = await Promise.all([
        axiosClient.get("/api/mon-hoc"),
        axiosClient.get("/api/khoa"),
      ]);
      setMonHocList(mh.data);
      setKhoaList(k.data);
    } catch (error) {
      console.error("Lỗi tải dữ liệu môn học");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setForm({ tenMonHoc: "", tinChi: "", maKhoa: "" });
    setEditingId(null);
  };

  const handleSubmit = async () => {
    if (!form.tenMonHoc || !form.tinChi || !form.maKhoa) {
      alert("⚠️ Vui lòng nhập đầy đủ tên môn, tín chỉ và chọn khoa!");
      return;
    }

    const payload = {
      tenMonHoc: form.tenMonHoc,
      tinChi: Number(form.tinChi),
      khoa: { maKhoa: Number(form.maKhoa) },
    };

    try {
      if (editingId) {
        await axiosClient.put(`/api/mon-hoc/${editingId}`, payload);
        alert("✅ Cập nhật môn học thành công!");
      } else {
        await axiosClient.post("/api/mon-hoc", payload);
        alert("✅ Thêm môn học thành công!");
      }
      resetForm();
      loadData();
    } catch (error) {
      alert("❌ Lỗi khi lưu môn học!");
    }
  };

  // 👇 HÀM XỬ LÝ XÓA ĐÃ ĐƯỢC THÊM LẠI 👇
  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "⚠️ Bạn có chắc chắn muốn xóa môn học này? Hành động này sẽ ảnh hưởng đến các lớp học liên quan.",
      )
    )
      return;
    try {
      await axiosClient.delete(`/api/mon-hoc/${id}`);
      alert("✅ Xóa môn học thành công!");
      loadData();
    } catch (error) {
      alert(
        "❌ Không thể xóa môn học này (có thể do đang có lớp học sử dụng)!",
      );
    }
  };

  const handleEdit = (mh) => {
    setEditingId(mh.maMonHoc);
    setForm({
      tenMonHoc: mh.tenMonHoc,
      tinChi: mh.tinChi,
      maKhoa: mh.khoa?.maKhoa || "",
    });
  };

  const handleImportExcel = async () => {
    if (!excelFile) return alert("⚠️ Chọn file Excel trước!");
    const formData = new FormData();
    formData.append("file", excelFile);
    try {
      await axiosClient.post("/api/mon-hoc/import-excel", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("✅ Import thành công!");
      setExcelFile(null);
      loadData();
    } catch (err) {
      alert("❌ Lỗi Import!");
    }
  };

  return (
    <DashboardLayout>
      <h3 className="text-primary fw-bold mb-4">📖 Quản lý Môn Học</h3>
      <div className="row">
        {/* CỘT TRÁI: FORM & IMPORT */}
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm border-0 mb-4 bg-light p-3">
            <h5 className="fw-bold mb-3">
              {editingId ? "✏️ Sửa môn học" : "➕ Thêm môn học"}
            </h5>
            <div className="mb-2">
              <label className="small fw-bold text-muted">Tên môn học</label>
              <input
                className="form-control"
                placeholder="Tên môn học"
                value={form.tenMonHoc}
                onChange={(e) =>
                  setForm({ ...form, tenMonHoc: e.target.value })
                }
              />
            </div>
            <div className="mb-2">
              <label className="small fw-bold text-muted">Số tín chỉ</label>
              <input
                className="form-control"
                type="number"
                placeholder="Số tín chỉ"
                value={form.tinChi}
                onChange={(e) => setForm({ ...form, tinChi: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label className="small fw-bold text-muted">Khoa phụ trách</label>
              <select
                className="form-select"
                value={form.maKhoa}
                onChange={(e) => setForm({ ...form, maKhoa: e.target.value })}
              >
                <option value="">-- Chọn khoa --</option>
                {khoaList.map((k) => (
                  <option key={k.maKhoa} value={k.maKhoa}>
                    {k.tenKhoa}
                  </option>
                ))}
              </select>
            </div>
            <div className="d-grid gap-2">
              <button
                className="btn btn-primary fw-bold"
                onClick={handleSubmit}
              >
                {editingId ? "Lưu cập nhật" : "Tạo môn học"}
              </button>
              {editingId && (
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={resetForm}
                >
                  Hủy
                </button>
              )}
            </div>
          </div>

          <div className="card shadow-sm border-0 p-3">
            <h6 className="fw-bold text-info mb-3">📁 Import Excel</h6>
            <input
              type="file"
              className="form-control form-control-sm mb-2"
              onChange={(e) => setExcelFile(e.target.files[0])}
            />
            <button
              className="btn btn-info text-white btn-sm w-100 fw-bold"
              onClick={handleImportExcel}
            >
              🚀 Tải lên
            </button>
          </div>
        </div>

        {/* CỘT PHẢI: DANH SÁCH */}
        <div className="col-md-8">
          <div className="card shadow-sm border-0">
            <div className="table-responsive" style={{ maxHeight: "700px" }}>
              <table className="table table-hover align-middle text-center mb-0">
                <thead className="table-primary sticky-top">
                  <tr>
                    <th>Mã</th>
                    <th className="text-start">Tên môn học</th>
                    <th>Khoa</th>
                    <th>Tín chỉ</th>
                    <th style={{ minWidth: "100px" }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {monHocList.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-4 text-muted">
                        Chưa có dữ liệu môn học.
                      </td>
                    </tr>
                  ) : (
                    monHocList.map((mh) => (
                      <tr key={mh.maMonHoc}>
                        <td className="text-muted">#{mh.maMonHoc}</td>
                        <td className="text-start fw-bold">{mh.tenMonHoc}</td>
                        <td className="small">{mh.khoa?.tenKhoa}</td>
                        <td>
                          <span className="badge bg-secondary">
                            {mh.tinChi} TC
                          </span>
                        </td>
                        <td>
                          <div className="btn-group">
                            <button
                              className="btn btn-sm btn-outline-warning"
                              onClick={() => handleEdit(mh)}
                            >
                              ✏️
                            </button>
                            {/* 👇 NÚT XÓA ĐÃ ĐƯỢC THÊM LẠI Ở ĐÂY 👇 */}
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDelete(mh.maMonHoc)}
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
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
