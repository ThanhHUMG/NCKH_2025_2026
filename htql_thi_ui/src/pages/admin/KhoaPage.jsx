import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import axiosClient from "../../api/axiosClient";
import ImportExcelBox from "../../components/ImportExcelBox"; // [cite: 713]
import Pagination from "../../components/Pagination";
import { Edit, Trash2, PlusCircle, Layers } from "lucide-react";

export default function KhoaPage() {
  const [list, setList] = useState([]);
  const [tenKhoa, setTenKhoa] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const loadData = async () => {
    const res = await axiosClient.get("/api/khoa");
    setList(res.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId)
        await axiosClient.put(`/api/khoa/${editingId}`, { tenKhoa });
      else await axiosClient.post("/api/khoa", { tenKhoa });
      setTenKhoa("");
      setEditingId(null);
      loadData();
    } catch (e) {
      alert("Lỗi dữ liệu!");
    }
  };

  const currentData = list.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <DashboardLayout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold text-dark d-flex align-items-center gap-2">
          <Layers className="text-primary" /> Quản lý Khoa
        </h3>
      </div>

      <div className="row g-4">
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
            <h5 className="fw-bold mb-4">
              {editingId ? "Cập nhật Khoa" : "Thêm Khoa mới"}
            </h5>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control rounded-3"
                  placeholder="Tên khoa (VD: CNTT)"
                  value={tenKhoa}
                  onChange={(e) => setTenKhoa(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary w-100 rounded-3 fw-bold py-2 shadow-sm"
              >
                {editingId ? (
                  "Lưu thay đổi"
                ) : (
                  <>
                    <PlusCircle size={18} className="me-1" /> Tạo mới
                  </>
                )}
              </button>
            </form>
          </div>
          <ImportExcelBox
            endpoint="/api/khoa/import-excel"
            onSuccess={loadData}
          />
        </div>

        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 p-4">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light text-muted small text-uppercase">
                <tr>
                  <th>Mã</th>
                  <th>Tên Khoa</th>
                  <th className="text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((k) => (
                  <tr key={k.maKhoa}>
                    <td className="text-muted fw-bold">#{k.maKhoa}</td>
                    <td className="fw-bold text-dark">{k.tenKhoa}</td>
                    <td className="text-center">
                      <button
                        className="btn btn-sm btn-light text-primary me-2"
                        onClick={() => {
                          setEditingId(k.maKhoa);
                          setTenKhoa(k.tenKhoa);
                        }}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="btn btn-sm btn-light text-danger"
                        onClick={async () => {
                          if (window.confirm("Xóa khoa này?")) {
                            await axiosClient.delete(`/api/khoa/${k.maKhoa}`);
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
