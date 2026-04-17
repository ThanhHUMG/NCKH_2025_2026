import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import axiosClient from "../../api/axiosClient";

export default function GiaoVienPage() {
  const [giaoVienList, setGiaoVienList] = useState([]);
  const [khoaList, setKhoaList] = useState([]);
  const [form, setForm] = useState({
    hoTen: "",
    namSinh: "",
    trinhDo: "",
    soDienThoai: "",
    email: "",
    diaChi: "",
    maKhoa: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [excelFile, setExcelFile] = useState(null);

  const loadGiaoVien = async () => {
    try {
      const res = await axiosClient.get("/api/giao-vien");
      setGiaoVienList(res.data);
    } catch (error) {
      console.error("Lỗi load giáo viên", error);
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
    loadGiaoVien();
    loadKhoa();
  }, []);

  const resetForm = () => {
    setForm({
      hoTen: "",
      namSinh: "",
      trinhDo: "",
      soDienThoai: "",
      email: "",
      diaChi: "",
      maKhoa: "",
    });
    setEditingId(null);
  };

  const handleSubmit = async () => {
    if (!form.hoTen || !form.namSinh || !form.trinhDo || !form.maKhoa) {
      alert("⚠️ Vui lòng nhập đầy đủ thông tin bắt buộc (*)");
      return;
    }

    const payload = {
      hoTen: form.hoTen,
      namSinh: Number(form.namSinh),
      trinhDo: form.trinhDo,
      soDienThoai: form.soDienThoai,
      email: form.email,
      diaChi: form.diaChi,
      khoa: {
        maKhoa: Number(form.maKhoa),
      },
    };

    try {
      if (editingId) {
        await axiosClient.put(`/api/giao-vien/${editingId}`, payload);
        alert("✅ Cập nhật giáo viên thành công!");
      } else {
        await axiosClient.post("/api/giao-vien", payload);
        alert("✅ Thêm giáo viên thành công!");
      }

      resetForm();
      loadGiaoVien();
    } catch (error) {
      alert(
        "❌ Có lỗi xảy ra, vui lòng kiểm tra lại (VD: trùng SĐT, Email...)",
      );
    }
  };

  const handleEdit = (gv) => {
    setEditingId(gv.maGiaoVien);
    setForm({
      hoTen: gv.hoTen || "",
      namSinh: gv.namSinh || "",
      trinhDo: gv.trinhDo || "",
      soDienThoai: gv.soDienThoai || "",
      email: gv.email || "",
      diaChi: gv.diaChi || "",
      maKhoa: gv.khoa?.maKhoa || "",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("⚠️ Bạn có chắc muốn xóa giáo viên này?")) return;
    try {
      await axiosClient.delete(`/api/giao-vien/${id}`);
      alert("✅ Xóa giáo viên thành công!");
      loadGiaoVien();
    } catch (error) {
      alert("❌ Lỗi khi xóa giáo viên!");
    }
  };

  const handleImportExcel = async () => {
    if (!excelFile) {
      alert("⚠️ Vui lòng chọn file Excel!");
      return;
    }

    const formData = new FormData();
    formData.append("file", excelFile);
    try {
      await axiosClient.post("/api/giao-vien/import-excel", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("✅ Import Excel giáo viên thành công!");
      setExcelFile(null);
      document.getElementById("excelFileInputGV").value = "";
      loadGiaoVien();
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
        <h3 className="text-primary fw-bold">👨‍🏫 Quản lý Giáo Viên</h3>
      </div>

      <div className="row">
        {/* CỘT TRÁI: FORM & IMPORT */}
        <div className="col-lg-4 mb-4">
          {/* FORM THÊM/SỬA */}
          <div className="card shadow-sm border-0 mb-4">
            <div
              className={`card-header text-white fw-bold ${editingId ? "bg-warning text-dark" : "bg-success"}`}
            >
              {editingId ? "✏️ Cập nhật thông tin" : "➕ Thêm giáo viên mới"}
            </div>
            <div className="card-body bg-light">
              <div className="mb-3">
                <label className="form-label text-muted small fw-bold">
                  Họ và tên *
                </label>
                <input
                  className="form-control form-control-sm"
                  placeholder="VD: Nguyễn Văn A"
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
                    placeholder="VD: 1980"
                    type="number"
                    value={form.namSinh}
                    onChange={(e) =>
                      setForm({ ...form, namSinh: e.target.value })
                    }
                  />
                </div>
                <div className="col-6">
                  <label className="form-label text-muted small fw-bold">
                    Trình độ *
                  </label>
                  <input
                    className="form-control form-control-sm"
                    placeholder="Thạc sĩ, Tiến sĩ..."
                    value={form.trinhDo}
                    onChange={(e) =>
                      setForm({ ...form, trinhDo: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label text-muted small fw-bold">
                  Khoa trực thuộc *
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
                id="excelFileInputGV"
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
                📋 Danh sách Giáo viên ({giaoVienList.length})
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
                      <th>Mã GV</th>
                      <th className="text-start">Họ tên</th>
                      <th>Trình độ</th>
                      <th>Khoa</th>
                      <th>Liên hệ</th>
                      <th style={{ minWidth: "100px" }}>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {giaoVienList.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center py-4 text-muted">
                          Chưa có dữ liệu giáo viên.
                        </td>
                      </tr>
                    ) : (
                      giaoVienList.map((gv) => (
                        <tr key={gv.maGiaoVien}>
                          <td className="fw-bold text-secondary">
                            GV{gv.maGiaoVien}
                          </td>
                          <td className="text-start fw-bold text-dark">
                            {gv.hoTen}
                          </td>
                          <td>
                            <span className="badge bg-primary bg-opacity-75">
                              {gv.trinhDo}
                            </span>
                          </td>
                          <td>{gv.khoa?.tenKhoa}</td>
                          <td className="text-start small">
                            {gv.soDienThoai && <div>📞 {gv.soDienThoai}</div>}
                            {gv.email && <div>✉️ {gv.email}</div>}
                          </td>
                          <td>
                            <div className="btn-group" role="group">
                              <button
                                className="btn btn-outline-warning btn-sm"
                                title="Sửa"
                                onClick={() => handleEdit(gv)}
                              >
                                ✏️
                              </button>
                              <button
                                className="btn btn-outline-danger btn-sm"
                                title="Xóa"
                                onClick={() => handleDelete(gv.maGiaoVien)}
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
