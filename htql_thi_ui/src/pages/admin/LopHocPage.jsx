import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import axiosClient from "../../api/axiosClient";

export default function LopHocPage() {
  const [lopHocList, setLopHocList] = useState([]);
  const [monHocList, setMonHocList] = useState([]);
  const [giaoVienList, setGiaoVienList] = useState([]);
  const [hocKyList, setHocKyList] = useState([]);
  const [sinhVienList, setSinhVienList] = useState([]);

  const [form, setForm] = useState({
    maMonHoc: "",
    maGiaoVien: "",
    maHocKi: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [selectedLopHocId, setSelectedLopHocId] = useState(null);
  const [selectedStudents, setSelectedStudents] = useState([]);

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
      alert("⚠️ Không load được dữ liệu!");
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleSubmit = async () => {
    if (!form.maMonHoc || !form.maGiaoVien || !form.maHocKi)
      return alert("⚠️ Thiếu thông tin!");
    try {
      const params = {
        maMonHoc: form.maMonHoc,
        maGiaoVien: form.maGiaoVien,
        maHocKi: form.maHocKi,
      };
      if (editingId)
        await axiosClient.put(`/api/lop-hoc/${editingId}`, null, { params });
      else await axiosClient.post("/api/lop-hoc", null, { params });
      alert("✅ Thành công!");
      setEditingId(null);
      setForm({ maMonHoc: "", maGiaoVien: "", maHocKi: "" });
      loadAll();
    } catch (err) {
      alert("❌ Lỗi: " + err.response?.data);
    }
  };

  const handleAddStudents = async () => {
    if (!selectedLopHocId || selectedStudents.length === 0)
      return alert("⚠️ Chọn lớp và sinh viên!");
    try {
      await axiosClient.post(
        `/api/lop-hoc/${selectedLopHocId}/add-sinh-vien`,
        selectedStudents.map(Number),
      );
      alert("✅ Đã thêm sinh viên vào lớp!");
      setSelectedStudents([]);
      loadAll();
    } catch (err) {
      alert("❌ Lỗi thêm SV!");
    }
  };

  return (
    <DashboardLayout>
      <h3 className="text-primary fw-bold mb-4">🏫 Quản lý Lớp Học</h3>
      <div className="row">
        {/* FORM TẠO LỚP */}
        <div className="col-md-4">
          <div className="card shadow-sm mb-4 border-0">
            <div className="card-header bg-success text-white fw-bold">
              ➕ {editingId ? "Sửa lớp" : "Tạo lớp học mới"}
            </div>
            <div className="card-body bg-light">
              <label className="small fw-bold text-muted">Môn học</label>
              <select
                className="form-select mb-2"
                value={form.maMonHoc}
                onChange={(e) => setForm({ ...form, maMonHoc: e.target.value })}
              >
                <option value="">-- Chọn môn --</option>
                {monHocList.map((mh) => (
                  <option key={mh.maMonHoc} value={mh.maMonHoc}>
                    {mh.tenMonHoc}
                  </option>
                ))}
              </select>
              <label className="small fw-bold text-muted">Giảng viên</label>
              <select
                className="form-select mb-2"
                value={form.maGiaoVien}
                onChange={(e) =>
                  setForm({ ...form, maGiaoVien: e.target.value })
                }
              >
                <option value="">-- Chọn GV --</option>
                {giaoVienList.map((gv) => (
                  <option key={gv.maGiaoVien} value={gv.maGiaoVien}>
                    {gv.hoTen}
                  </option>
                ))}
              </select>
              <label className="small fw-bold text-muted">Học kỳ</label>
              <select
                className="form-select mb-3"
                value={form.maHocKi}
                onChange={(e) => setForm({ ...form, maHocKi: e.target.value })}
              >
                <option value="">-- Chọn HK --</option>
                {hocKyList.map((hk) => (
                  <option key={hk.maHocKi} value={hk.maHocKi}>
                    {hk.tenHocKy}
                  </option>
                ))}
              </select>
              <button
                className="btn btn-success w-100 fw-bold"
                onClick={handleSubmit}
              >
                {editingId ? "💾 Cập nhật" : "✅ Tạo lớp"}
              </button>
            </div>
          </div>

          <div className="card shadow-sm border-0 border-top border-primary border-3">
            <div className="card-body">
              <h6 className="fw-bold text-primary mb-3">
                👥 Gán sinh viên vào lớp
              </h6>
              <select
                className="form-select mb-2"
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
              <select
                multiple
                className="form-select mb-3"
                style={{ height: 150 }}
                value={selectedStudents}
                onChange={(e) =>
                  setSelectedStudents(
                    Array.from(e.target.selectedOptions, (o) => o.value),
                  )
                }
              >
                {sinhVienList.map((sv) => (
                  <option key={sv.msv} value={sv.msv}>
                    {sv.msv} - {sv.hoTen}
                  </option>
                ))}
              </select>
              <button
                className="btn btn-primary btn-sm w-100"
                onClick={handleAddStudents}
              >
                🚀 Thêm SV vào lớp
              </button>
            </div>
          </div>
        </div>

        {/* DANH SÁCH LỚP */}
        <div className="col-md-8">
          <div className="card shadow-sm border-0">
            <div className="card-body p-0">
              <table className="table table-hover align-middle mb-0 text-center">
                <thead className="table-dark">
                  <tr>
                    <th>Mã Lớp</th>
                    <th className="text-start">Môn học</th>
                    <th>Giảng viên</th>
                    <th>Sĩ số</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {lopHocList.map((lh) => (
                    <tr key={lh.maLopHoc}>
                      <td className="fw-bold">{lh.maLopHoc}</td>
                      <td className="text-start">
                        {lh.monHoc?.tenMonHoc} <br />
                        <small className="text-muted">
                          {lh.hocKi?.tenHocKy}
                        </small>
                      </td>
                      <td>{lh.giaoVien?.hoTen}</td>
                      <td>
                        <span className="badge bg-info text-dark">
                          {lh.dsSinhVien?.length || 0} SV
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-warning me-1"
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
                          className="btn btn-sm btn-outline-danger"
                          onClick={async () => {
                            if (window.confirm("Xóa?")) {
                              await axiosClient.delete(
                                `/api/lop-hoc/${lh.maLopHoc}`,
                              );
                              loadAll();
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
      </div>
    </DashboardLayout>
  );
}
