import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import { getAllKiThi } from "../../api/kiThiApi";
import { getAllGiaoVien } from "../../api/giaoVienApi";
import { getMonThiByKiThi, updateMonThi } from "../../api/monThiApi";

export default function MonThiPage() {
  const [kiThiList, setKiThiList] = useState([]);
  const [giaoVienList, setGiaoVienList] = useState([]);
  const [maKiThi, setMaKiThi] = useState("");
  const [monThiList, setMonThiList] = useState([]);
  const [editMonThi, setEditMonThi] = useState(null);

  const loadInit = async () => {
    const [kt, gv] = await Promise.all([getAllKiThi(), getAllGiaoVien()]);
    setKiThiList(kt);
    setGiaoVienList(gv);
  };

  useEffect(() => {
    loadInit();
  }, []);

  const handleSelectKiThi = async (value) => {
    setMaKiThi(value);
    if (!value) {
      setMonThiList([]);
      return;
    }
    const list = await getMonThiByKiThi(Number(value));
    setMonThiList(list);
  };

  const handleSave = async () => {
    if (
      !editMonThi.hinhThucThi ||
      !editMonThi.phongThi ||
      !editMonThi.thoiGianThi ||
      !editMonThi.dsMaGiamThi?.length
    ) {
      return alert(
        "⚠️ Vui lòng điền đủ: Hình thức, Phòng, Thời gian và Giám thị!",
      );
    }
    await updateMonThi(
      editMonThi.maMonThi,
      editMonThi.hinhThucThi,
      editMonThi.phongThi,
      editMonThi.thoiGianThi,
      editMonThi.dsMaGiamThi,
    );
    alert("✅ Cập nhật môn thi thành công!");
    setEditMonThi(null);
    handleSelectKiThi(maKiThi);
  };

  return (
    <DashboardLayout>
      <h3 className="text-primary fw-bold mb-4">
        📝 Quản lý Lịch Thi & Môn Thi
      </h3>

      <div className="card shadow-sm border-0 p-4 mb-4 bg-light">
        <label className="fw-bold mb-2">
          🔍 Chọn kỳ thi để xem danh sách môn:
        </label>
        <select
          className="form-select border-primary w-50"
          value={maKiThi}
          onChange={(e) => handleSelectKiThi(e.target.value)}
        >
          <option value="">-- Chọn kỳ thi --</option>
          {kiThiList.map((kt) => (
            <option key={kt.maKiThi} value={kt.maKiThi}>
              {kt.tenKiThi} ({kt.hocKi?.tenHocKy})
            </option>
          ))}
        </select>
      </div>

      {maKiThi ? (
        <div className="card shadow-sm border-0 overflow-hidden">
          <table className="table table-hover align-middle mb-0 text-center">
            <thead className="table-dark">
              <tr>
                <th>Mã</th>
                <th className="text-start">Tên môn thi</th>
                <th>Hình thức</th>
                <th>Phòng</th>
                <th>Thời gian</th>
                <th>Giám thị</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {monThiList.map((mt) => (
                <tr key={mt.maMonThi}>
                  <td>#{mt.maMonThi}</td>
                  <td className="text-start fw-bold">
                    {mt.tenMonThi} <br />
                    <small className="text-muted text-uppercase">
                      Lớp: {mt.lopHoc?.maLopHoc}
                    </small>
                  </td>
                  <td>
                    <span className="badge bg-info text-dark">
                      {mt.hinhThucThi || "Chưa xếp"}
                    </span>
                  </td>
                  <td className="fw-bold text-primary">
                    {mt.phongThi || "---"}
                  </td>
                  <td className="small">
                    {mt.thoiGianThi
                      ? new Date(mt.thoiGianThi).toLocaleString("vi-VN")
                      : "Chưa có"}
                  </td>
                  <td className="small">
                    {mt.dsGiamThi?.length
                      ? mt.dsGiamThi.map((g) => g.hoTen).join(", ")
                      : "Chưa chọn"}
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-warning fw-bold"
                      onClick={() =>
                        setEditMonThi({
                          ...mt,
                          dsMaGiamThi:
                            mt.dsGiamThi?.map((x) => x.maGiaoVien) || [],
                        })
                      }
                    >
                      Thiết lập
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="alert alert-secondary border-0 shadow-sm">
          Vui lòng chọn một kỳ thi ở trên để quản lý chi tiết các môn thi.
        </div>
      )}

      {/* MODAL CẬP NHẬT */}
      {editMonThi && (
        <div
          className="modal show d-block"
          style={{ background: "rgba(0,0,0,0.6)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title fw-bold">
                  ⚙️ Thiết lập môn: {editMonThi.tenMonThi}
                </h5>
                <button
                  className="btn-close btn-close-white"
                  onClick={() => setEditMonThi(null)}
                ></button>
              </div>
              <div className="modal-body p-4">
                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label small fw-bold">
                      Hình thức
                    </label>
                    <select
                      className="form-select"
                      value={editMonThi.hinhThucThi || ""}
                      onChange={(e) =>
                        setEditMonThi({
                          ...editMonThi,
                          hinhThucThi: e.target.value,
                        })
                      }
                    >
                      <option value="">-- Chọn --</option>
                      <option value="Trắc nghiệm">Trắc nghiệm</option>
                      <option value="Tự luận">Tự luận</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-bold">
                      Phòng thi
                    </label>
                    <input
                      className="form-control"
                      placeholder="VD: A101"
                      value={editMonThi.phongThi || ""}
                      onChange={(e) =>
                        setEditMonThi({
                          ...editMonThi,
                          phongThi: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-bold">
                      Thời gian thi
                    </label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      value={editMonThi.thoiGianThi?.slice(0, 16) || ""}
                      onChange={(e) =>
                        setEditMonThi({
                          ...editMonThi,
                          thoiGianThi: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label small fw-bold">
                      Giám thị (Chọn tối đa 3)
                    </label>
                    <select
                      multiple
                      className="form-select"
                      style={{ height: "150px" }}
                      value={editMonThi.dsMaGiamThi}
                      onChange={(e) =>
                        setEditMonThi({
                          ...editMonThi,
                          dsMaGiamThi: Array.from(
                            e.target.selectedOptions,
                            (o) => Number(o.value),
                          ),
                        })
                      }
                    >
                      {giaoVienList.map((gv) => (
                        <option key={gv.maGiaoVien} value={gv.maGiaoVien}>
                          {gv.hoTen} - {gv.khoa?.tenKhoa}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer bg-light">
                <button
                  className="btn btn-secondary px-4"
                  onClick={() => setEditMonThi(null)}
                >
                  Đóng
                </button>
                <button
                  className="btn btn-primary px-4 fw-bold"
                  onClick={handleSave}
                >
                  Lưu thay đổi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
