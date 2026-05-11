import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import axiosClient from "../../api/axiosClient";
import ImportExcelBox from "../../components/ImportExcelBox";
import { PenTool, Search, BarChart3, UploadCloud } from "lucide-react";

export default function DiemPage() {
  const [lopHocList, setLopHocList] = useState([]);
  const [maLopHoc, setMaLopHoc] = useState("");
  const [thongKe, setThongKe] = useState(null);

  useEffect(() => {
    axiosClient.get("/api/lop-hoc").then((res) => setLopHocList(res.data));
  }, []);

  const loadThongKe = async (id) => {
    if (!id) {
      setThongKe(null);
      return;
    }
    try {
      const res = await axiosClient.get(`/api/diem-thi/lop-hoc/${id}/thong-ke`);
      setThongKe(res.data);
    } catch (e) {
      alert("Lớp này chưa có dữ liệu điểm để thống kê!");
      setThongKe(null);
    }
  };

  const handleSelectLopHoc = (e) => {
    setMaLopHoc(e.target.value);
    loadThongKe(e.target.value);
  };

  return (
    <DashboardLayout>
      <h3 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2">
        <PenTool className="text-success" /> Quản lý Điểm Tổng Kết
      </h3>

      {/* 1. KHU VỰC IMPORT TOÀN TRƯỜNG (KHÔNG CẦN CHỌN LỚP) */}
      <div
        className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white"
        style={{ borderTop: "4px solid #0d6efd" }}
      >
        <h5 className="fw-bold mb-3 d-flex align-items-center gap-2 text-primary">
          <UploadCloud size={20} /> Import Điểm Cuối Kỳ Toàn Trường
        </h5>
        <div className="row align-items-center">
          <div className="col-md-6">
            <div className="alert alert-info rounded-3 small mb-0 border-0">
              <span className="fw-bold d-block mb-1">
                💡 Hệ thống Tự Động Định Tuyến:
              </span>
              Bạn <strong>không cần chọn lớp</strong>. Hệ thống sẽ tự tìm lớp
              học dựa trên Mã Sinh Viên và Mã Môn Học trong file. <br />
              <br />
              <strong>Cấu trúc file bắt buộc (Dòng 1 là tiêu đề):</strong>
              <br />
              STT (A) | MSV (B) | Họ Tên (C) | Mã Môn (D) | Tên Môn (E) | Điểm
              (F)
            </div>
          </div>
          <div className="col-md-6 mt-3 mt-md-0">
            <ImportExcelBox
              endpoint="/api/diem-thi/import"
              onSuccess={() => {
                // Tải lại thống kê nếu đang xem một lớp
                if (maLopHoc) loadThongKe(maLopHoc);
              }}
              title="Tải lên File Điểm Excel"
            />
          </div>
        </div>
      </div>

      {/* 2. KHU VỰC CHỌN LỚP ĐỂ XEM THỐNG KÊ */}
      <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
        <label className="fw-bold mb-3 d-flex align-items-center gap-2 text-dark">
          <Search size={18} className="text-warning" /> Chọn Lớp Học để xem
          Thống kê Phổ Điểm
        </label>
        <select
          className="form-select form-select-lg rounded-3 bg-light shadow-none"
          value={maLopHoc}
          onChange={handleSelectLopHoc}
        >
          <option value="">-- Click để chọn Lớp học --</option>
          {lopHocList.map((lh) => (
            <option key={lh.maLopHoc} value={lh.maLopHoc}>
              Lớp #{lh.maLopHoc} - {lh.monHoc?.tenMonHoc} (GV:{" "}
              {lh.giaoVien?.hoTen})
            </option>
          ))}
        </select>
      </div>

      {/* 3. KHU VỰC HIỂN THỊ THỐNG KÊ (Giữ nguyên) */}
      {thongKe && (
        <div className="card border-0 shadow-sm rounded-4 p-4">
          <h5 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2">
            <BarChart3 size={22} className="text-primary" /> Phổ Điểm:{" "}
            {thongKe.tenMonHoc}
          </h5>
          <div className="row text-center mb-4 g-3">
            <div className="col-md-3">
              <div className="p-4 bg-light rounded-4 shadow-sm border">
                <h6 className="text-muted fw-bold">Tổng SV</h6>
                <h2 className="fw-bold mb-0">{thongKe.tongSoSinhVien}</h2>
              </div>
            </div>
            <div className="col-md-3">
              <div className="p-4 bg-success bg-opacity-10 text-success rounded-4 shadow-sm">
                <h6 className="fw-bold">Đạt</h6>
                <h2 className="fw-bold mb-0">{thongKe.soLuongDat}</h2>
              </div>
            </div>
            <div className="col-md-3">
              <div className="p-4 bg-danger bg-opacity-10 text-danger rounded-4 shadow-sm">
                <h6 className="fw-bold">Trượt</h6>
                <h2 className="fw-bold mb-0">{thongKe.soLuongTruot}</h2>
              </div>
            </div>
            <div className="col-md-3">
              <div className="p-4 bg-primary bg-opacity-10 text-primary rounded-4 shadow-sm">
                <h6 className="fw-bold">Tỉ lệ Đạt</h6>
                <h2 className="fw-bold mb-0">{thongKe.tiLeDat}%</h2>
              </div>
            </div>
          </div>
          <div className="table-responsive">
            <table
              className="table table-bordered align-middle text-center mb-0"
              style={{ tableLayout: "fixed" }}
            >
              <thead className="table-light text-muted fw-bold">
                <tr>
                  <th>A+</th>
                  <th>A</th>
                  <th>B+</th>
                  <th>B</th>
                  <th>C+</th>
                  <th>C</th>
                  <th>D+</th>
                  <th>D</th>
                  <th className="text-danger">F</th>
                </tr>
              </thead>
              <tbody>
                <tr className="fs-5">
                  <td className="fw-bold">{thongKe.diemA_Plus}</td>
                  <td className="fw-bold">{thongKe.diemA}</td>
                  <td className="fw-bold text-primary">{thongKe.diemB_Plus}</td>
                  <td className="fw-bold text-primary">{thongKe.diemB}</td>
                  <td className="fw-bold text-success">{thongKe.diemC_Plus}</td>
                  <td className="fw-bold text-success">{thongKe.diemC}</td>
                  <td className="fw-bold text-warning">{thongKe.diemD_Plus}</td>
                  <td className="fw-bold text-warning">{thongKe.diemD}</td>
                  <td className="fw-bold text-danger bg-danger bg-opacity-10">
                    {thongKe.diemF}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
