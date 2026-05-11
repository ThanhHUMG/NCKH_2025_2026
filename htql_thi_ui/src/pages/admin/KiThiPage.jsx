import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import axiosClient from "../../api/axiosClient";
import Pagination from "../../components/Pagination";
import { ClipboardCheck, Trash2 } from "lucide-react";

export default function KiThiPage() {
  const [list, setList] = useState([]);
  const [hocKys, setHocKys] = useState([]);
  const [form, setForm] = useState({ tenKiThi: "", maHocKi: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const loadData = async () => {
    const [kt, hk] = await Promise.all([
      axiosClient.get("/api/ki-thi"),
      axiosClient.get("/api/hoc-ky"),
    ]);
    setList(kt.data);
    setHocKys(hk.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.post("/api/ki-thi", form);
      setForm({ tenKiThi: "", maHocKi: "" });
      alert("✅ Khởi tạo kỳ thi thành công!");
      loadData();
    } catch (e) {
      alert("❌ Lỗi khi tạo kỳ thi!");
    }
  };

  const currentData = list.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <DashboardLayout>
      <h3 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2">
        <ClipboardCheck className="text-danger" /> Quản lý Kỳ Thi
      </h3>
      <div className="row g-4">
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 p-4">
            <h5 className="fw-bold mb-4">Khởi tạo Kỳ Thi</h5>
            <form onSubmit={handleCreate}>
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control rounded-3"
                  id="ktName"
                  placeholder="VD: Cuối kỳ 1"
                  value={form.tenKiThi}
                  onChange={(e) =>
                    setForm({ ...form, tenKiThi: e.target.value })
                  }
                  required
                />
                <label htmlFor="ktName">Tên Kỳ Thi</label>
              </div>
              <div className="mb-4">
                <select
                  className="form-select rounded-3 py-3"
                  value={form.maHocKi}
                  onChange={(e) =>
                    setForm({ ...form, maHocKi: e.target.value })
                  }
                  required
                >
                  <option value="">-- Chọn Học kỳ áp dụng --</option>
                  {hocKys.map((hk) => (
                    <option key={hk.maHocKi} value={hk.maHocKi}>
                      {hk.tenHocKy}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="btn btn-danger w-100 rounded-3 fw-bold py-2 shadow-sm"
              >
                🚀 Khởi tạo Kỳ thi
              </button>
            </form>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 p-4">
            <table className="table table-hover align-middle mb-0 text-center">
              <thead className="table-light small text-uppercase">
                <tr>
                  <th>Mã</th>
                  <th className="text-start">Tên Kỳ Thi</th>
                  <th>Thuộc Học Kỳ</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((kt) => (
                  <tr key={kt.maKiThi}>
                    <td className="fw-bold text-secondary">#{kt.maKiThi}</td>
                    <td className="text-start fw-bold text-dark">
                      {kt.tenKiThi}
                    </td>
                    <td>
                      <span className="badge bg-light text-dark border">
                        {kt.hocKi?.tenHocKy}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-light text-danger"
                        onClick={async () => {
                          if (
                            window.confirm(
                              "Xóa kỳ thi sẽ xóa mọi lịch thi liên quan?",
                            )
                          ) {
                            await axiosClient.delete(
                              `/api/ki-thi/${kt.maKiThi}`,
                            );
                            loadData();
                          }
                        }}
                      >
                        <Trash2 size={16} /> Xóa
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
