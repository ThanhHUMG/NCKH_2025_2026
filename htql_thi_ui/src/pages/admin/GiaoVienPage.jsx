import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import axiosClient from "../../api/axiosClient";
import ImportExcelBox from "../../components/ImportExcelBox";
import Pagination from "../../components/Pagination";
import { Users, Edit, Trash2 } from "lucide-react";

export default function GiaoVienPage() {
  const [list, setList] = useState([]);
  const [khoas, setKhoas] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    maGiaoVien: "",
    hoTen: "",
    namSinh: "",
    trinhDo: "",
    soDienThoai: "",
    email: "",
    diaChi: "",
    maKhoa: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const loadData = async () => {
    const [gv, k] = await Promise.all([
      axiosClient.get("/api/giao-vien"),
      axiosClient.get("/api/khoa"),
    ]);
    setList(gv.data);
    setKhoas(k.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      maGiaoVien: Number(form.maGiaoVien),
      namSinh: Number(form.namSinh),
      khoa: { maKhoa: Number(form.maKhoa) },
    };

    try {
      if (editingId)
        await axiosClient.put(`/api/giao-vien/${editingId}`, payload);
      else await axiosClient.post("/api/giao-vien", payload);

      setForm({
        maGiaoVien: "",
        hoTen: "",
        namSinh: "",
        trinhDo: "",
        soDienThoai: "",
        email: "",
        diaChi: "",
        maKhoa: "",
      });
      setEditingId(null);
      loadData();
    } catch (error) {
      alert(error.response?.data || "❌ Lỗi: Mã GV tồn tại hoặc sai dữ liệu!");
    }
  };

  const currentData = list.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <DashboardLayout>
      <h3 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2">
        <Users className="text-primary" /> Quản lý Giáo Viên
      </h3>
      <div className="row g-4">
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
            <h5 className="fw-bold mb-4">
              {editingId ? "Sửa thông tin" : "Thêm Giáo Viên"}
            </h5>
            <form onSubmit={handleSubmit}>
              <input
                type="number"
                className="form-control mb-2 rounded-3 bg-light"
                placeholder="Mã Giáo Viên *"
                value={form.maGiaoVien}
                onChange={(e) =>
                  setForm({ ...form, maGiaoVien: e.target.value })
                }
                disabled={!!editingId}
                required
              />
              <input
                type="text"
                className="form-control mb-2 rounded-3"
                placeholder="Họ và tên *"
                value={form.hoTen}
                onChange={(e) => setForm({ ...form, hoTen: e.target.value })}
                required
              />
              <div className="row g-2 mb-2">
                <div className="col-6">
                  <input
                    type="number"
                    className="form-control rounded-3"
                    placeholder="Năm sinh *"
                    value={form.namSinh}
                    onChange={(e) =>
                      setForm({ ...form, namSinh: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="col-6">
                  <input
                    type="text"
                    className="form-control rounded-3"
                    placeholder="Trình độ *"
                    value={form.trinhDo}
                    onChange={(e) =>
                      setForm({ ...form, trinhDo: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <select
                className="form-select mb-2 rounded-3"
                value={form.maKhoa}
                onChange={(e) => setForm({ ...form, maKhoa: e.target.value })}
                required
              >
                <option value="">-- Khoa trực thuộc * --</option>
                {khoas.map((k) => (
                  <option key={k.maKhoa} value={k.maKhoa}>
                    {k.tenKhoa}
                  </option>
                ))}
              </select>
              <input
                type="text"
                className="form-control mb-2 rounded-3"
                placeholder="Số điện thoại"
                value={form.soDienThoai}
                onChange={(e) =>
                  setForm({ ...form, soDienThoai: e.target.value })
                }
              />
              <input
                type="email"
                className="form-control mb-2 rounded-3"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <input
                type="text"
                className="form-control mb-3 rounded-3"
                placeholder="Địa chỉ"
                value={form.diaChi}
                onChange={(e) => setForm({ ...form, diaChi: e.target.value })}
              />
              <button
                type="submit"
                className="btn btn-primary w-100 rounded-3 fw-bold py-2"
              >
                {editingId ? "Cập nhật" : "Tạo mới"}
              </button>
            </form>
          </div>
          <ImportExcelBox
            endpoint="/api/giao-vien/import-excel"
            onSuccess={loadData}
            title="Import Giáo Viên"
          />
        </div>

        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 p-4">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light small text-uppercase">
                <tr>
                  <th>MGV</th>
                  <th>Giáo Viên</th>
                  <th>Liên Hệ</th>
                  <th>Khoa</th>
                  <th className="text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((gv) => (
                  <tr key={gv.maGiaoVien}>
                    <td className="fw-bold text-secondary">#{gv.maGiaoVien}</td>
                    <td>
                      <div className="fw-bold">{gv.hoTen}</div>
                      <span className="badge bg-light text-dark border">
                        {gv.trinhDo}
                      </span>
                    </td>
                    <td className="small text-muted">
                      <div>📞 {gv.soDienThoai || "---"}</div>
                      <div>✉️ {gv.email || "---"}</div>
                    </td>
                    <td>{gv.khoa?.tenKhoa}</td>
                    <td className="text-center">
                      <button
                        className="btn btn-sm btn-light text-primary me-2"
                        onClick={() => {
                          setEditingId(gv.maGiaoVien);
                          setForm({
                            maGiaoVien: gv.maGiaoVien,
                            hoTen: gv.hoTen,
                            namSinh: gv.namSinh,
                            trinhDo: gv.trinhDo,
                            soDienThoai: gv.soDienThoai || "",
                            email: gv.email || "",
                            diaChi: gv.diaChi || "",
                            maKhoa: gv.khoa?.maKhoa,
                          });
                        }}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="btn btn-sm btn-light text-danger"
                        onClick={async () => {
                          if (window.confirm("Xóa giáo viên?")) {
                            await axiosClient.delete(
                              `/api/giao-vien/${gv.maGiaoVien}`,
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
