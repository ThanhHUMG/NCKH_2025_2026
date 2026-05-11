import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import axiosClient from "../../api/axiosClient";
import ImportExcelBox from "../../components/ImportExcelBox";
import {
  Calendar,
  UserPlus,
  CheckCircle,
  Search,
  ClipboardList,
} from "lucide-react";

export default function LichThiPage() {
  const [kiThiList, setKiThiList] = useState([]);
  const [maKiThi, setMaKiThi] = useState("");
  const [lichThiList, setLichThiList] = useState([]);
  const [giaoVienList, setGiaoVienList] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [selectedLichThi, setSelectedLichThi] = useState(null);
  const [selectedGiaoVien, setSelectedGiaoVien] = useState("");

  useEffect(() => {
    // 1. Lấy danh sách Kỳ Thi để chọn
    axiosClient.get("/api/ki-thi").then((res) => setKiThiList(res.data));
    // 2. Lấy danh sách Giáo Viên để phân công
    axiosClient.get("/api/giao-vien").then((res) => setGiaoVienList(res.data));
    // 3. Lấy tất cả lịch thi ban đầu
    loadLichThi();
  }, []);

  const loadLichThi = (kiThiId = "") => {
    const url = kiThiId ? `/api/lich-thi/ki-thi/${kiThiId}` : "/api/lich-thi";
    axiosClient.get(url).then((res) => setLichThiList(res.data));
  };

  const handleSelectKiThi = (e) => {
    const id = e.target.value;
    setMaKiThi(id);
    loadLichThi(id);
  };

  const openPhanCongModal = (lichThi) => {
    setSelectedLichThi(lichThi);
    setSelectedGiaoVien(lichThi.giaoVienCoiThi?.maGiaoVien || "");
    setShowModal(true);
  };

  const handlePhanCong = async () => {
    if (!selectedGiaoVien) return alert("Vui lòng chọn giáo viên!");
    try {
      await axiosClient.put(
        `/api/lich-thi/${selectedLichThi.maLichThi}/phan-cong-coi-thi?maGiaoVien=${selectedGiaoVien}`,
      );
      alert("Đã phân công giáo viên coi thi!");
      setShowModal(false);
      loadLichThi(maKiThi);
    } catch (e) {
      alert("Lỗi: " + (e.response?.data || e.message));
    }
  };

  return (
    <DashboardLayout>
      <h3 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2">
        <Calendar className="text-primary" /> Quản lý Lịch Thi & Phân Công
      </h3>

      <div className="row g-4 mb-4">
        {/* KHỐI 1: CHỌN KỲ THI & LỌC */}
        <div className="col-md-6">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white">
            <label className="fw-bold mb-3 d-flex align-items-center gap-2">
              <Search size={18} className="text-primary" /> Bước 1: Chọn Kỳ Thi
            </label>
            <select
              className="form-select form-select-lg rounded-3 bg-light shadow-none"
              value={maKiThi}
              onChange={handleSelectKiThi}
            >
              <option value="">-- Tất cả kỳ thi --</option>
              {kiThiList.map((kt) => (
                <option key={kt.maKiThi} value={kt.maKiThi}>
                  {kt.tenKiThi} ({kt.namHoc})
                </option>
              ))}
            </select>
            <p className="mt-3 text-muted small">
              * Vui lòng chọn một kỳ thi cụ thể trước khi tải lên file Excel
              lịch thi.
            </p>
          </div>
        </div>

        {/* KHỐI 2: IMPORT EXCEL THEO KỲ THI */}
        <div className="col-md-6">
          <div className="h-100">
            {maKiThi ? (
              <ImportExcelBox
                endpoint={`/api/lich-thi/ki-thi/${maKiThi}/import`}
                onSuccess={() => loadLichThi(maKiThi)}
                title="Bước 2: Tải lên Lịch Thi (Excel)"
              />
            ) : (
              <div className="card border-0 shadow-sm rounded-4 h-100 d-flex justify-content-center align-items-center bg-light text-muted border-dashed p-4">
                <div className="text-center opacity-50">
                  <ClipboardList size={40} />
                  <p className="mb-0 mt-2">
                    Chọn Kỳ thi bên trái để mở chức năng Import
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* DANH SÁCH LỊCH THI */}
      <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
        <h5 className="fw-bold mb-4">
          Danh sách lịch thi {maKiThi && `Kỳ thi #${maKiThi}`}
        </h5>
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Môn Học</th>
                <th>Phòng</th>
                <th>Ngày Thi</th>
                <th>Cán Bộ Coi Thi</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {lichThiList.map((lt) => (
                <tr key={lt.maLichThi}>
                  <td>#{lt.maLichThi}</td>
                  <td>
                    <div className="fw-bold">{lt.monHoc?.tenMonHoc}</div>
                    <small className="text-muted">
                      Mã: {lt.monHoc?.maMonHoc}
                    </small>
                  </td>
                  <td>
                    <span className="badge bg-light text-dark border">
                      {lt.phongThi}
                    </span>
                  </td>
                  <td>
                    {lt.thoiGian} <br />
                    <small className="text-primary">
                      Tiết bắt đầu: {lt.tietBatDau}
                    </small>
                  </td>
                  <td>
                    {lt.giaoVienCoiThi ? (
                      <span className="badge bg-success bg-opacity-10 text-success p-2">
                        <CheckCircle size={14} className="me-1" />{" "}
                        {lt.giaoVienCoiThi.hoTen}
                      </span>
                    ) : (
                      <span className="text-muted small italic">
                        Chưa phân công
                      </span>
                    )}
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-primary rounded-3"
                      onClick={() => openPhanCongModal(lt)}
                    >
                      <UserPlus size={14} className="me-1" /> Phân công
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL PHÂN CÔNG */}
      {showModal && (
        <>
          <div className="modal-backdrop fade show"></div>
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow rounded-4">
                <div className="modal-header">
                  <h5 className="modal-title fw-bold">Phân công coi thi</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="fw-bold mb-2">Chọn Giáo Viên</label>
                    <select
                      className="form-select rounded-3 shadow-none"
                      value={selectedGiaoVien}
                      onChange={(e) => setSelectedGiaoVien(e.target.value)}
                    >
                      <option value="">-- Chọn cán bộ coi thi --</option>
                      {giaoVienList.map((gv) => (
                        <option key={gv.maGiaoVien} value={gv.maGiaoVien}>
                          {gv.hoTen} (Khoa {gv.khoa?.tenKhoa})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="modal-footer border-0">
                  <button
                    className="btn btn-light"
                    onClick={() => setShowModal(false)}
                  >
                    Hủy
                  </button>
                  <button
                    className="btn btn-primary px-4"
                    onClick={handlePhanCong}
                  >
                    Xác nhận
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
