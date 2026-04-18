import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import axiosClient from "../../api/axiosClient";

export default function LopHocPage() {
  // 1. STATE DỮ LIỆU TỪ API
  const [lopHocList, setLopHocList] = useState([]);
  const [monHocList, setMonHocList] = useState([]);
  const [giaoVienList, setGiaoVienList] = useState([]);
  const [hocKyList, setHocKyList] = useState([]);
  const [sinhVienList, setSinhVienList] = useState([]);

  // 2. STATE FORM & TƯƠNG TÁC
  const [form, setForm] = useState({
    maMonHoc: "",
    maGiaoVien: "",
    maHocKi: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [selectedLopHocId, setSelectedLopHocId] = useState(null);
  const [selectedStudents, setSelectedStudents] = useState([]);

  // ================= LOAD DỮ LIỆU =================
  const loadAll = async () => {
    try {
      const [lh, mh, gv, hk, sv] = await Promise.all([
        axiosClient.get("/api/lop-hoc"),
        axiosClient.get("/api/mon-hoc"),
        axiosClient.get("/api/giao-vien"),
        axiosClient.get("/api/hoc-ky"),
        axiosClient.get("/api/sinh-vien"),
      ]);
      setLopHocList(lh.data);
      setMonHocList(mh.data);
      setGiaoVienList(gv.data);
      setHocKyList(hk.data);
      setSinhVienList(sv.data);
    } catch (err) {
      alert("⚠️ Không load được dữ liệu hệ thống!");
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  // ================= EFFECTS (TỰ ĐỘNG RESET DỮ LIỆU) =================
  // Tự động reset Giảng viên khi đổi Môn học (chỉ áp dụng khi tạo mới)
  useEffect(() => {
    if (!editingId) {
      setForm((prev) => ({ ...prev, maGiaoVien: "" }));
    }
  }, [form.maMonHoc, editingId]);

  // Tự động reset danh sách chọn Sinh viên khi người dùng chọn Lớp khác
  useEffect(() => {
    setSelectedStudents([]);
  }, [selectedLopHocId]);

  // ================= LOGIC LỌC DỮ LIỆU THEO KHOA =================
  // Lọc Giảng viên: Lấy mã khoa của môn học đang chọn trên form
  const selectedMonHocForm = monHocList.find(
    (mh) => mh.maMonHoc === Number(form.maMonHoc),
  );
  const maKhoaForm = selectedMonHocForm?.khoa?.maKhoa;
  const filteredGiaoVienList = maKhoaForm
    ? giaoVienList.filter((gv) => gv.khoa?.maKhoa === maKhoaForm)
    : [];

  // Lọc Sinh viên: Lấy mã khoa của môn học thuộc lớp đang chọn để gán
  const selectedLopHoc = lopHocList.find(
    (lh) => lh.maLopHoc === Number(selectedLopHocId),
  );
  const maKhoaMonHocHienTai = selectedLopHoc?.monHoc?.khoa?.maKhoa;
  const filteredSinhVienList = maKhoaMonHocHienTai
    ? sinhVienList.filter((sv) => sv.khoa?.maKhoa === maKhoaMonHocHienTai)
    : [];

  // ================= HANDLERS =================
  const handleSubmit = async () => {
    if (!form.maMonHoc || !form.maGiaoVien || !form.maHocKi) {
      return alert("⚠️ Vui lòng điền đầy đủ thông tin!");
    }
    try {
      const params = {
        maMonHoc: form.maMonHoc,
        maGiaoVien: form.maGiaoVien,
        maHocKi: form.maHocKi,
      };
      if (editingId) {
        await axiosClient.put(`/api/lop-hoc/${editingId}`, null, { params });
        alert("✅ Cập nhật lớp học thành công!");
      } else {
        await axiosClient.post("/api/lop-hoc", null, { params });
        alert("✅ Tạo lớp học mới thành công!");
      }
      setEditingId(null);
      setForm({ maMonHoc: "", maGiaoVien: "", maHocKi: "" });
      loadAll();
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || err.response?.data || "Có lỗi xảy ra";
      alert("❌ Lỗi: " + errorMsg);
    }
  };

  const handleAddStudents = async () => {
    if (!selectedLopHocId || selectedStudents.length === 0) {
      return alert("⚠️ Hãy chọn lớp và ít nhất một sinh viên!");
    }
    try {
      await axiosClient.post(
        `/api/lop-hoc/${selectedLopHocId}/add-sinh-vien`,
        selectedStudents.map(Number),
      );
      alert("✅ Đã gán sinh viên vào lớp thành công!");
      setSelectedStudents([]);
      loadAll();
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || err.response?.data || "Lỗi thêm SV!";
      alert("❌ " + errorMsg);
    }
  };

  return (
    <DashboardLayout>
      <div className="d-flex align-items-center mb-4">
        <h3 className="text-primary fw-bold mb-0">🏫 Quản lý Lớp Học</h3>
      </div>

      <div className="row g-4">
        {/* ================= CỘT TRÁI: FORMS ================= */}
        <div className="col-md-4">
          {/* FORM TẠO/SỬA LỚP HỌC */}
          <div className="card shadow-sm border-0 rounded-4 mb-4 bg-white">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4 text-dark">
                {editingId ? "✏️ Sửa lớp học" : "➕ Tạo lớp học mới"}
              </h5>

              <div className="mb-3">
                <label className="small fw-bold text-muted mb-1">Môn học</label>
                <select
                  className="form-select rounded-3"
                  value={form.maMonHoc}
                  onChange={(e) =>
                    setForm({ ...form, maMonHoc: e.target.value })
                  }
                >
                  <option value="">-- Chọn môn học --</option>
                  {monHocList.map((mh) => (
                    <option key={mh.maMonHoc} value={mh.maMonHoc}>
                      {mh.tenMonHoc} ({mh.khoa?.tenKhoa})
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="small fw-bold text-muted mb-1">
                  Giảng viên phụ trách
                </label>
                <select
                  className="form-select rounded-3"
                  value={form.maGiaoVien}
                  onChange={(e) =>
                    setForm({ ...form, maGiaoVien: e.target.value })
                  }
                  disabled={!form.maMonHoc} // Khóa nếu chưa chọn môn
                >
                  <option value="">
                    {!form.maMonHoc
                      ? "-- Vui lòng chọn môn học trước --"
                      : "-- Chọn Giảng viên --"}
                  </option>
                  {filteredGiaoVienList.map((gv) => (
                    <option key={gv.maGiaoVien} value={gv.maGiaoVien}>
                      {gv.hoTen} ({gv.khoa?.tenKhoa})
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="small fw-bold text-muted mb-1">Học kỳ</label>
                <select
                  className="form-select rounded-3"
                  value={form.maHocKi}
                  onChange={(e) =>
                    setForm({ ...form, maHocKi: e.target.value })
                  }
                >
                  <option value="">-- Chọn học kỳ --</option>
                  {hocKyList.map((hk) => (
                    <option key={hk.maHocKi} value={hk.maHocKi}>
                      {hk.tenHocKy}
                    </option>
                  ))}
                </select>
              </div>

              <button
                className="btn btn-primary w-100 fw-bold rounded-3 py-2 shadow-sm"
                onClick={handleSubmit}
              >
                {editingId ? "💾 Lưu Cập Nhật" : "✅ Tạo Lớp Học"}
              </button>

              {editingId && (
                <button
                  className="btn btn-light w-100 fw-bold rounded-3 py-2 mt-2 text-danger border"
                  onClick={() => {
                    setEditingId(null);
                    setForm({ maMonHoc: "", maGiaoVien: "", maHocKi: "" });
                  }}
                >
                  Hủy sửa
                </button>
              )}
            </div>
          </div>

          {/* FORM GÁN SINH VIÊN */}
          <div
            className="card shadow-sm border-0 rounded-4 bg-white"
            style={{ borderTop: "4px solid #198754" }}
          >
            <div className="card-body p-4">
              <h5 className="fw-bold text-success mb-3">
                👥 Gán sinh viên vào lớp
              </h5>

              <select
                className="form-select rounded-3 mb-3"
                value={selectedLopHocId || ""}
                onChange={(e) => setSelectedLopHocId(e.target.value)}
              >
                <option value="">-- Chọn lớp học --</option>
                {lopHocList.map((lh) => (
                  <option key={lh.maLopHoc} value={lh.maLopHoc}>
                    Lớp #{lh.maLopHoc} - {lh.monHoc?.tenMonHoc}
                  </option>
                ))}
              </select>

              <label className="small fw-bold text-muted mb-1">
                Giữ Ctrl/Cmd để chọn nhiều SV
              </label>
              <select
                multiple
                className="form-select rounded-3 mb-3"
                style={{ height: 160 }}
                value={selectedStudents}
                onChange={(e) =>
                  setSelectedStudents(
                    Array.from(e.target.selectedOptions, (o) => o.value),
                  )
                }
              >
                {filteredSinhVienList.length === 0 ? (
                  <option disabled>
                    {selectedLopHocId
                      ? "Trống (Không có SV cùng khoa)"
                      : "-- Vui lòng chọn lớp học trước --"}
                  </option>
                ) : (
                  filteredSinhVienList.map((sv) => (
                    <option key={sv.msv} value={sv.msv}>
                      {sv.msv} - {sv.hoTen} ({sv.khoa?.tenKhoa})
                    </option>
                  ))
                )}
              </select>

              <button
                className="btn btn-success w-100 fw-bold rounded-3 py-2 shadow-sm"
                onClick={handleAddStudents}
              >
                🚀 Gán SV vào Lớp
              </button>
            </div>
          </div>
        </div>

        {/* ================= CỘT PHẢI: BẢNG DANH SÁCH LỚP ================= */}
        <div className="col-md-8">
          <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
            <div
              className="table-responsive"
              style={{ maxHeight: "800px", overflowY: "auto" }}
            >
              <table className="table table-hover align-middle mb-0 text-center">
                <thead className="table-light text-muted small text-uppercase sticky-top">
                  <tr>
                    <th className="py-3">Mã Lớp</th>
                    <th className="text-start py-3">Môn học / Học kỳ</th>
                    <th className="py-3">Giảng viên</th>
                    <th className="py-3">Sĩ số</th>
                    <th className="py-3">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {lopHocList.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-5 text-muted">
                        <div className="fs-1 mb-2">📭</div>
                        Chưa có lớp học nào.
                      </td>
                    </tr>
                  ) : (
                    lopHocList.map((lh) => (
                      <tr key={lh.maLopHoc}>
                        <td className="fw-bold text-secondary">
                          #{lh.maLopHoc}
                        </td>
                        <td className="text-start">
                          <div className="fw-bold text-dark">
                            {lh.monHoc?.tenMonHoc}
                          </div>
                          <small className="text-muted">
                            {lh.hocKi?.tenHocKy}
                          </small>
                        </td>
                        <td className="fw-medium text-dark">
                          {lh.giaoVien?.hoTen}
                        </td>
                        <td>
                          <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3 py-2">
                            {lh.dsSinhVien?.length || 0} SV
                          </span>
                        </td>
                        <td>
                          <div className="btn-group gap-2">
                            <button
                              className="btn btn-sm btn-outline-warning rounded-3"
                              title="Sửa lớp"
                              onClick={() => {
                                setEditingId(lh.maLopHoc);
                                setForm({
                                  maMonHoc: lh.monHoc?.maMonHoc,
                                  maGiaoVien: lh.giaoVien?.maGiaoVien,
                                  maHocKi: lh.hocKi?.maHocKi,
                                });
                              }}
                            >
                              ✏️
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger rounded-3"
                              title="Xóa lớp"
                              onClick={async () => {
                                if (
                                  window.confirm(
                                    "Bạn có chắc chắn muốn xóa lớp học này?",
                                  )
                                ) {
                                  try {
                                    await axiosClient.delete(
                                      `/api/lop-hoc/${lh.maLopHoc}`,
                                    );
                                    alert("✅ Xóa thành công!");
                                    loadAll();
                                  } catch (err) {
                                    alert("❌ Lỗi xóa lớp học!");
                                  }
                                }
                              }}
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
