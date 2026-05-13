import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import axiosClient from "../../api/axiosClient";
import ImportExcelBox from "../../components/ImportExcelBox";
import Pagination from "../../components/Pagination";
import { BookOpen, Edit, Trash2 } from "lucide-react";

export default function MonHocPage() {
  const [list, setList] = useState([]);
  const [khoas, setKhoas] = useState([]);
  const [form, setForm] = useState({
    maMonHoc: "",
    tenMonHoc: "",
    tinChi: "",
    maKhoa: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const loadData = async () => {
    const [mh, k] = await Promise.all([
      axiosClient.get("/api/mon-hoc"),
      axiosClient.get("/api/khoa"),
    ]);
    setList(mh.data);
    setKhoas(k.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      maMonHoc: Number(form.maMonHoc),
      tenMonHoc: form.tenMonHoc,
      tinChi: Number(form.tinChi),
      khoa: { maKhoa: Number(form.maKhoa) },
    };

    try {
      if (editingId)
        await axiosClient.put(`/api/mon-hoc/${editingId}`, payload);
      else await axiosClient.post("/api/mon-hoc", payload);

      setForm({ maMonHoc: "", tenMonHoc: "", tinChi: "", maKhoa: "" });
      setEditingId(null);
      loadData();
    } catch (e) {
      alert(e.response?.data || "Lỗi dữ liệu (Mã môn có thể đã tồn tại)!");
    }
  };

  const currentData = list.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <DashboardLayout>
      <h3 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2">
        <BookOpen className="text-success" /> Quản lý Môn Học
      </h3>
      <div className="row g-4">
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
            <h5 className="fw-bold mb-4">
              {editingId ? "Sửa Môn Học" : "Thêm Môn Học"}
            </h5>
            <form onSubmit={handleSubmit}>
              <input
                type="number"
                className="form-control rounded-3 mb-2 bg-light"
                placeholder="Mã môn học *"
                value={form.maMonHoc}
                onChange={(e) => setForm({ ...form, maMonHoc: e.target.value })}
                disabled={!!editingId} // Khóa khi sửa
                required
              />
              <input
                type="text"
                className="form-control rounded-3 mb-2"
                placeholder="Tên môn học *"
                value={form.tenMonHoc}
                onChange={(e) =>
                  setForm({ ...form, tenMonHoc: e.target.value })
                }
                required
              />
              <input
                type="number"
                className="form-control rounded-3 mb-2"
                placeholder="Số tín chỉ *"
                value={form.tinChi}
                onChange={(e) => setForm({ ...form, tinChi: e.target.value })}
                required
              />
              <select
                className="form-select rounded-3 mb-3"
                value={form.maKhoa}
                onChange={(e) => setForm({ ...form, maKhoa: e.target.value })}
                required
              >
                <option value="">-- Chọn khoa trực thuộc --</option>
                {khoas.map((k) => (
                  <option key={k.maKhoa} value={k.maKhoa}>
                    {k.tenKhoa}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="btn btn-success w-100 rounded-3 fw-bold py-2 shadow-sm"
              >
                {editingId ? "Cập nhật" : "Tạo mới"}
              </button>
            </form>
          </div>
          <ImportExcelBox
            endpoint="/api/mon-hoc/import-excel"
            onSuccess={loadData}
          />
        </div>

        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 p-4">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light small text-uppercase">
                <tr>
                  <th>Mã Môn</th>
                  <th>Tên Môn</th>
                  <th>Khoa</th>
                  <th>Tín chỉ</th>
                  <th className="text-center">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((m) => (
                  <tr key={m.maMonHoc}>
                    <td className="text-muted fw-bold">#{m.maMonHoc}</td>
                    <td className="fw-bold">{m.tenMonHoc}</td>
                    <td>{m.khoa?.tenKhoa}</td>
                    <td>
                      <span className="badge bg-light text-dark border">
                        {m.tinChi} TC
                      </span>
                    </td>
                    <td className="text-center">
                      <button
                        className="btn btn-sm btn-light text-primary me-2"
                        onClick={() => {
                          setEditingId(m.maMonHoc);
                          setForm({
                            maMonHoc: m.maMonHoc,
                            tenMonHoc: m.tenMonHoc,
                            tinChi: m.tinChi,
                            maKhoa: m.khoa?.maKhoa,
                          });
                        }}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="btn btn-sm btn-light text-danger"
                        onClick={async () => {
                          if (window.confirm("Xóa môn học này?")) {
                            await axiosClient.delete(
                              `/api/mon-hoc/${m.maMonHoc}`,
                            );
                            loadData();
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
