import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import axiosClient from "../../api/axiosClient";

export default function SinhVienPage() {
  const [sinhVienList, setSinhVienList] = useState([]);
  const [khoaList, setKhoaList] = useState([]);

  const [form, setForm] = useState({
    hoTen: "",
    namSinh: "",
    nienKhoa: "",
    soDienThoai: "",
    email: "",
    diaChi: "",
    maKhoa: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [excelFile, setExcelFile] = useState(null);

  const loadSinhVien = async () => {
    try {
      const res = await axiosClient.get("/api/sinh-vien");
      setSinhVienList(res.data);
    } catch (error) {
      console.error("Lỗi load sinh viên", error);
    }
  };

  const loadKhoa = async () => {
    try {
      const res = await axiosClient.get("/api/khoa");
      setKhoaList(res.data);
    } catch (error) {
      console.error("Lỗi load khoa", error);
    }
  };

  useEffect(() => {
    loadSinhVien();
    loadKhoa();
  }, []);

  const resetForm = () => {
    setForm({
      hoTen: "",
      namSinh: "",
      nienKhoa: "",
      soDienThoai: "",
      email: "",
      diaChi: "",
      maKhoa: "",
    });
    setEditingId(null);
  };

  const handleSubmit = async () => {
    if (!form.hoTen || !form.namSinh || !form.nienKhoa || !form.maKhoa) {
      alert(
        "⚠️ Vui lòng nhập đầy đủ thông tin (Họ tên, Năm sinh, Niên khóa, Khoa)!",
      );
      return;
    }

    const payload = {
      hoTen: form.hoTen,
      namSinh: Number(form.namSinh),
      nienKhoa: form.nienKhoa,
      soDienThoai: form.soDienThoai,
      email: form.email,
      diaChi: form.diaChi,
      khoa: {
        maKhoa: Number(form.maKhoa),
      },
    };

    try {
      if (editingId) {
        await axiosClient.put(`/api/sinh-vien/${editingId}`, payload);
        alert("✅ Cập nhật sinh viên thành công!");
      } else {
        await axiosClient.post("/api/sinh-vien", payload);
        alert("✅ Thêm sinh viên thành công!");
      }

      resetForm();
      loadSinhVien();
    } catch (error) {
      alert("❌ Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  const handleEdit = (sv) => {
    setEditingId(sv.msv);
    setForm({
      hoTen: sv.hoTen || "",
      namSinh: sv.namSinh || "",
      nienKhoa: sv.nienKhoa || "",
      soDienThoai: sv.soDienThoai || "",
      email: sv.email || "",
      diaChi: sv.diaChi || "",
      maKhoa: sv.khoa?.maKhoa || "",
    });
  };

  const handleDelete = async (msv) => {
    if (
      !window.confirm(
        "⚠️ Bạn có chắc chắn muốn xóa sinh viên này? Hành động này không thể hoàn tác.",
      )
    )
      return;
    try {
      await axiosClient.delete(`/api/sinh-vien/${msv}`);
      alert("✅ Xóa sinh viên thành công!");
      loadSinhVien();
    } catch (error) {
      alert("❌ Lỗi khi xóa sinh viên!");
    }
  };

  const handleImportExcel = async () => {
    if (!excelFile) {
      alert("⚠️ Vui lòng chọn file Excel trước!");
      return;
    }

    const formData = new FormData();
    formData.append("file", excelFile);

    try {
      await axiosClient.post("/api/sinh-vien/import-excel", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("✅ Import Excel sinh viên thành công!");
      setExcelFile(null);
      // Reset input file (optional but good UX)
      document.getElementById("excelFileInput").value = "";
      loadSinhVien();
    } catch (error) {
      alert(
        "❌ Lỗi import Excel: " +
          (error.response?.data || "Kiểm tra lại định dạng file"),
      );
    }
  };

  return (
    <DashboardLayout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="text-primary fw-bold">🎓 Quản lý Sinh Viên</h3>
      </div>

      <div className="row">
        {/* CỘT TRÁI: FORM & IMPORT */}
        <div className="col-lg-4 mb-4">
          {/* FORM THÊM/SỬA */}
          <div className="card shadow-sm border-0 mb-4">
            <div
              className={`card-header text-white fw-bold ${editingId ? "bg-warning" : "bg-success"}`}
            >
              {editingId ? "✏️ Cập nhật sinh viên" : "➕ Thêm sinh viên mới"}
            </div>
            <div className="card-body bg-light">
              <div className="mb-3">
                <label className="form-label text-muted small fw-bold">
                  Họ và tên *
                </label>
                <input
                  className="form-control form-control-sm"
                  placeholder="Nhập họ tên"
                  value={form.hoTen}
                  onChange={(e) => setForm({ ...form, hoTen: e.target.value })}
                />
              </div>

              <div className="row mb-3">
                <div className="col-6">
                  <label className="form-label text-muted small fw-bold">
                    Năm sinh *
                  </label>
                  <input
                    className="form-control form-control-sm"
                    placeholder="VD: 2004"
                    type="number"
                    value={form.namSinh}
                    onChange={(e) =>
                      setForm({ ...form, namSinh: e.target.value })
                    }
                  />
                </div>
                <div className="col-6">
                  <label className="form-label text-muted small fw-bold">
                    Niên khóa *
                  </label>
                  <input
                    className="form-control form-control-sm"
                    placeholder="VD: K62"
                    value={form.nienKhoa}
                    onChange={(e) =>
                      setForm({ ...form, nienKhoa: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label text-muted small fw-bold">
                  Khoa *
                </label>
                <select
                  className="form-select form-select-sm"
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

              <div className="mb-3">
                <label className="form-label text-muted small fw-bold">
                  Số điện thoại
                </label>
                <input
                  className="form-control form-control-sm"
                  placeholder="Nhập SĐT"
                  value={form.soDienThoai}
                  onChange={(e) =>
                    setForm({ ...form, soDienThoai: e.target.value })
                  }
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-muted small fw-bold">
                  Email
                </label>
                <input
                  className="form-control form-control-sm"
                  placeholder="Nhập Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>

              <div className="mb-4">
                <label className="form-label text-muted small fw-bold">
                  Địa chỉ
                </label>
                <input
                  className="form-control form-control-sm"
                  placeholder="Nhập địa chỉ"
                  value={form.diaChi}
                  onChange={(e) => setForm({ ...form, diaChi: e.target.value })}
                />
              </div>

              <div className="d-grid gap-2">
                <button
                  className={`btn ${editingId ? "btn-warning fw-bold text-dark" : "btn-success fw-bold"}`}
                  onClick={handleSubmit}
                >
                  {editingId ? "💾 Lưu Cập Nhật" : "✅ Tạo Mới"}
                </button>
                {editingId && (
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={resetForm}
                  >
                    ❌ Hủy thao tác
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* IMPORT EXCEL */}
          <div className="card shadow-sm border-0 border-top border-info border-3">
            <div className="card-body">
              <h6 className="card-title text-info fw-bold mb-3">
                📁 Import từ Excel
              </h6>
              <input
                id="excelFileInput"
                type="file"
                className="form-control form-control-sm mb-3"
                onChange={(e) => setExcelFile(e.target.files[0])}
              />
              <button
                className="btn btn-info btn-sm text-white w-100 fw-bold"
                onClick={handleImportExcel}
              >
                🚀 Tải lên dữ liệu
              </button>
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: BẢNG DỮ LIỆU */}
        <div className="col-lg-8">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
              <h5 className="mb-0 text-dark fw-bold">
                📋 Danh sách Sinh viên ({sinhVienList.length})
              </h5>
            </div>
            <div className="card-body p-0">
              <div
                className="table-responsive"
                style={{ maxHeight: "800px", overflowY: "auto" }}
              >
                <table className="table table-hover align-middle mb-0 text-center">
                  <thead className="table-light text-muted sticky-top">
                    <tr>
                      <th>MSV</th>
                      <th className="text-start">Họ tên</th>
                      <th>Năm sinh</th>
                      <th>Khóa</th>
                      <th>Khoa</th>
                      <th>Liên hệ</th>
                      <th style={{ minWidth: "120px" }}>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sinhVienList.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center py-4 text-muted">
                          Chưa có dữ liệu sinh viên.
                        </td>
                      </tr>
                    ) : (
                      sinhVienList.map((sv) => (
                        <tr key={sv.msv}>
                          <td className="fw-bold text-secondary">{sv.msv}</td>
                          <td className="text-start fw-bold text-dark">
                            {sv.hoTen}
                          </td>
                          <td>{sv.namSinh}</td>
                          <td>
                            <span className="badge bg-secondary">
                              {sv.nienKhoa}
                            </span>
                          </td>
                          <td>{sv.khoa?.tenKhoa}</td>
                          <td className="text-start small">
                            {sv.soDienThoai && <div>📞 {sv.soDienThoai}</div>}
                            {sv.email && <div>✉️ {sv.email}</div>}
                          </td>
                          <td>
                            <div className="btn-group" role="group">
                              <button
                                className="btn btn-outline-warning btn-sm"
                                title="Sửa"
                                onClick={() => handleEdit(sv)}
                              >
                                ✏️
                              </button>
                              <button
                                className="btn btn-outline-danger btn-sm"
                                title="Xóa"
                                onClick={() => handleDelete(sv.msv)}
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
      </div>
    </DashboardLayout>
  );
}
