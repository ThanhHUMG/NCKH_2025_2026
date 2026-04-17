import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import { getAllHocKy } from "../../api/hocKyApi";
import { createKiThi, deleteKiThi, getAllKiThi } from "../../api/kiThiApi";

export default function KiThiPage() {
  const [hocKyList, setHocKyList] = useState([]);
  const [kiThiList, setKiThiList] = useState([]);
  const [tenKiThi, setTenKiThi] = useState("");
  const [maHocKi, setMaHocKi] = useState("");

  const loadData = async () => {
    const [hk, kt] = await Promise.all([getAllHocKy(), getAllKiThi()]);
    setHocKyList(hk);
    setKiThiList(kt);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async () => {
    if (!tenKiThi.trim() || !maHocKi)
      return alert("⚠️ Vui lòng nhập tên kỳ thi và chọn học kỳ!");
    await createKiThi(tenKiThi, Number(maHocKi));
    alert(
      "✅ Tạo kỳ thi thành công! Hệ thống đã tự động khởi tạo danh sách môn thi tương ứng.",
    );
    setTenKiThi("");
    setMaHocKi("");
    loadData();
  };

  return (
    <DashboardLayout>
      <h3 className="text-primary fw-bold mb-4">🏆 Quản lý Kỳ Thi</h3>
      <div className="row">
        <div className="col-md-5 mb-4">
          <div className="card shadow-sm border-0 border-top border-primary border-4 p-4 bg-white">
            <h5 className="fw-bold mb-4 text-dark">➕ Tạo kỳ thi mới</h5>
            <div className="mb-3">
              <label className="form-label small fw-bold text-muted">
                Tên kỳ thi
              </label>
              <input
                className="form-control"
                value={tenKiThi}
                onChange={(e) => setTenKiThi(e.target.value)}
                placeholder="VD: Thi học kỳ 2 - Chính thức"
              />
            </div>
            <div className="mb-4">
              <label className="form-label small fw-bold text-muted">
                Học kỳ áp dụng
              </label>
              <select
                className="form-select"
                value={maHocKi}
                onChange={(e) => setMaHocKi(e.target.value)}
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
              className="btn btn-primary w-100 fw-bold py-2 shadow-sm"
              onClick={handleCreate}
            >
              KHỞI TẠO KỲ THI
            </button>
            <div className="mt-3 small text-muted italic">
              * Lưu ý: Khi tạo kỳ thi, các lớp học thuộc học kỳ đã chọn sẽ tự
              động được gán môn thi tương ứng.
            </div>
          </div>
        </div>
        <div className="col-md-7">
          <div className="card shadow-sm border-0">
            <table className="table table-hover align-middle mb-0 text-center">
              <thead className="table-dark">
                <tr>
                  <th width="80">Mã</th>
                  <th className="text-start">Tên kỳ thi</th>
                  <th>Học kỳ</th>
                  <th width="120">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {kiThiList.map((kt) => (
                  <tr key={kt.maKiThi}>
                    <td className="text-muted fw-bold">#{kt.maKiThi}</td>
                    <td className="text-start fw-bold text-primary">
                      {kt.tenKiThi}
                    </td>
                    <td>
                      <span className="badge bg-light text-dark border">
                        {kt.hocKi?.tenHocKy}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={async () => {
                          if (window.confirm("Xóa kỳ thi này?")) {
                            await deleteKiThi(kt.maKiThi);
                            loadData();
                          }
                        }}
                      >
                        🗑️ Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
