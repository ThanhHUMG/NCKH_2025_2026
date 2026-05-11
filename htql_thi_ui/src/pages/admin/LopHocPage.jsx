import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import axiosClient from "../../api/axiosClient";
import Pagination from "../../components/Pagination";
import ImportExcelBox from "../../components/ImportExcelBox";
import { School, Edit, Trash2, FileSpreadsheet } from "lucide-react";

export default function LopHocPage() {
  const [list, setList] = useState([]);
  const [monHocs, setMonHocs] = useState([]);
  const [giaoViens, setGiaoViens] = useState([]);
  const [hocKys, setHocKys] = useState([]);

  // Form thêm/sửa lớp
  const [form, setForm] = useState({
    maMonHoc: "",
    maGiaoVien: "",
    maHocKi: "",
  });
  const [editingId, setEditingId] = useState(null);

  // State phục vụ việc Import Sinh Viên
  const [importLopId, setImportLopId] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const loadAll = async () => {
    try {
      const [lh, mh, gv, hk] = await Promise.all([
        axiosClient.get("/api/lop-hoc"),
        axiosClient.get("/api/mon-hoc"),
        axiosClient.get("/api/giao-vien"),
        axiosClient.get("/api/hoc-ky"),
      ]);
      setList(lh.data);
      setMonHocs(mh.data);
      setGiaoViens(gv.data);
      setHocKys(hk.data);
    } catch (e) {
      alert("Lỗi tải dữ liệu!");
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const params = {
        maMonHoc: form.maMonHoc,
        maGiaoVien: form.maGiaoVien,
        maHocKi: form.maHocKi,
      };
      if (editingId)
        await axiosClient.put(`/api/lop-hoc/${editingId}`, null, { params });
      else await axiosClient.post("/api/lop-hoc", null, { params });
      setForm({ maMonHoc: "", maGiaoVien: "", maHocKi: "" });
      setEditingId(null);
      loadAll();
    } catch (e) {
      alert("❌ Lỗi khi lưu Lớp học!");
    }
  };

  const currentData = list.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <DashboardLayout>
      <h3 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2">
        <School className="text-primary" /> Quản lý Lớp Học
      </h3>

      <div className="row g-4">
        <div className="col-lg-4">
          {/* Card: Thêm / Sửa Lớp học */}
          <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
            <h5 className="fw-bold mb-4">
              {editingId ? "Sửa Lớp Học" : "Thêm Lớp Mới"}
            </h5>
            <form onSubmit={handleSubmit}>
              <select
                className="form-select mb-3 rounded-3"
                value={form.maMonHoc}
                onChange={(e) => setForm({ ...form, maMonHoc: e.target.value })}
                required
              >
                <option value="">-- Chọn Môn học --</option>
                {monHocs.map((m) => (
                  <option key={m.maMonHoc} value={m.maMonHoc}>
                    {m.tenMonHoc}
                  </option>
                ))}
              </select>
              <select
                className="form-select mb-3 rounded-3"
                value={form.maGiaoVien}
                onChange={(e) =>
                  setForm({ ...form, maGiaoVien: e.target.value })
                }
                required
              >
                <option value="">-- Chọn Giảng viên --</option>
                {giaoViens.map((g) => (
                  <option key={g.maGiaoVien} value={g.maGiaoVien}>
                    {g.hoTen}
                  </option>
                ))}
              </select>
              <select
                className="form-select mb-4 rounded-3"
                value={form.maHocKi}
                onChange={(e) => setForm({ ...form, maHocKi: e.target.value })}
                required
              >
                <option value="">-- Chọn Học kỳ --</option>
                {hocKys.map((h) => (
                  <option key={h.maHocKi} value={h.maHocKi}>
                    {h.tenHocKy}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="btn btn-primary w-100 rounded-3 fw-bold"
              >
                {editingId ? "Cập nhật Lớp" : "Tạo Lớp Học"}
              </button>
            </form>
          </div>

          {/* Card: Import Excel Sinh viên vào Lớp */}
          <div
            className="card border-0 shadow-sm rounded-4 p-4"
            style={{ borderTop: "4px solid #198754" }}
          >
            <h5 className="fw-bold mb-3 text-success d-flex align-items-center gap-2">
              <FileSpreadsheet size={20} /> Thêm SV (Excel)
            </h5>
            <select
              className="form-select mb-3 rounded-3 bg-light"
              value={importLopId}
              onChange={(e) => setImportLopId(e.target.value)}
            >
              <option value="">-- Chọn Lớp cần Import --</option>
              {list.map((lh) => (
                <option key={lh.maLopHoc} value={lh.maLopHoc}>
                  Lớp #{lh.maLopHoc} - {lh.monHoc?.tenMonHoc}
                </option>
              ))}
            </select>

            {importLopId ? (
              <ImportExcelBox
                endpoint={`/api/lop-hoc/${importLopId}/import-sinh-vien`}
                onSuccess={() => {
                  loadAll();
                  setImportLopId("");
                }}
                title="Tải lên danh sách SV"
              />
            ) : (
              <div className="text-muted small text-center p-2 border border-dashed rounded-3">
                Vui lòng chọn lớp để hiện khung tải file Excel.
              </div>
            )}
          </div>
        </div>

        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 p-4">
            <table className="table table-hover align-middle mb-0 text-center">
              <thead className="table-light small text-uppercase">
                <tr>
                  <th>Mã Lớp</th>
                  <th className="text-start">Môn / Học Kỳ</th>
                  <th>Giảng Viên</th>
                  <th>Sĩ số</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((lh) => (
                  <tr key={lh.maLopHoc}>
                    <td className="fw-bold text-secondary">#{lh.maLopHoc}</td>
                    <td className="text-start">
                      <div className="fw-bold">{lh.monHoc?.tenMonHoc}</div>
                      <div className="small text-muted">
                        {lh.hocKi?.tenHocKy}
                      </div>
                    </td>
                    <td className="fw-medium">{lh.giaoVien?.hoTen}</td>
                    <td>
                      <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3 py-2">
                        {lh.dsSinhVien?.length || 0} SV
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-light text-primary me-2 border"
                        onClick={() => {
                          setEditingId(lh.maLopHoc);
                          setForm({
                            maMonHoc: lh.monHoc?.maMonHoc,
                            maGiaoVien: lh.giaoVien?.maGiaoVien,
                            maHocKi: lh.hocKi?.maHocKi,
                          });
                        }}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="btn btn-sm btn-light text-danger border"
                        onClick={async () => {
                          if (window.confirm("Xóa lớp học?")) {
                            await axiosClient.delete(
                              `/api/lop-hoc/${lh.maLopHoc}`,
                            );
                            loadAll();
                          }
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination
              currentPage={currentPage}
              totalItems={list.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
