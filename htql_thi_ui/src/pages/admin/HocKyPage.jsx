import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import axiosClient from "../../api/axiosClient";
import ImportExcelBox from "../../components/ImportExcelBox";
import Pagination from "../../components/Pagination";
import { CalendarDays, Edit, Trash2 } from "lucide-react";

export default function HocKyPage() {
  const [list, setList] = useState([]);
  const [tenHocKy, setTenHocKy] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const loadData = async () => {
    const res = await axiosClient.get("/api/hoc-ky");
    setList(res.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId)
      await axiosClient.put(`/api/hoc-ky/${editingId}`, { tenHocKy });
    else await axiosClient.post("/api/hoc-ky", { tenHocKy });
    setTenHocKy("");
    setEditingId(null);
    loadData();
  };

  const currentData = list.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <DashboardLayout>
      <h3 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2">
        <CalendarDays className="text-warning" /> Quản lý Học Kỳ
      </h3>
      <div className="row g-4">
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
            <h5 className="fw-bold mb-4">
              {editingId ? "Sửa Học Kỳ" : "Thêm Học Kỳ"}
            </h5>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                className="form-control rounded-3 mb-3"
                placeholder="VD: Kỳ 1 - 2025"
                value={tenHocKy}
                onChange={(e) => setTenHocKy(e.target.value)}
                required
              />
              <button
                type="submit"
                className="btn btn-warning w-100 rounded-3 fw-bold py-2 shadow-sm"
              >
                {editingId ? "Cập nhật" : "Tạo mới"}
              </button>
            </form>
          </div>
          <ImportExcelBox
            endpoint="/api/hoc-ky/import-excel"
            onSuccess={loadData}
          />
        </div>
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 p-4">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light small text-uppercase">
                <tr>
                  <th>ID</th>
                  <th>Tên Học Kỳ</th>
                  <th className="text-center">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((h) => (
                  <tr key={h.maHocKi}>
                    <td>#{h.maHocKi}</td>
                    <td className="fw-bold">{h.tenHocKy}</td>
                    <td className="text-center">
                      <button
                        className="btn btn-sm btn-light text-primary me-2"
                        onClick={() => {
                          setEditingId(h.maHocKi);
                          setTenHocKy(h.tenHocKy);
                        }}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="btn btn-sm btn-light text-danger"
                        onClick={async () => {
                          if (window.confirm("Xóa?")) {
                            await axiosClient.delete(
                              `/api/hoc-ky/${h.maHocKi}`,
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
