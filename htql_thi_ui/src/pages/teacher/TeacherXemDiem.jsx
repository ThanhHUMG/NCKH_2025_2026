import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import axiosClient from "../../api/axiosClient";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import { BarChart3 } from "lucide-react";

export default function TeacherXemDiem() {
  const [lopHocList, setLopHocList] = useState([]);
  const [selectedLop, setSelectedLop] = useState(null);
  const [thongKe, setThongKe] = useState(null);

  useEffect(() => {
    axiosClient
      .get("/api/teacher/lop-hoc")
      .then((res) => setLopHocList(res.data));
  }, []);

  const handleSelectLop = async (lh) => {
    setSelectedLop(lh);
    try {
      // Backend của bạn cung cấp API thống kê chung cho Lớp học
      const res = await axiosClient.get(
        `/api/diem-thi/lop-hoc/${lh.maLopHoc}/thong-ke`,
      );
      setThongKe(res.data);
    } catch (error) {
      alert("Lớp học này chưa có dữ liệu điểm để thống kê!");
      setThongKe(null);
    }
  };

  const chartData = thongKe
    ? {
        labels: ["A+", "A", "B+", "B", "C+", "C", "D+", "D", "F"],
        datasets: [
          {
            label: "Số lượng Sinh viên",
            backgroundColor: "rgba(102, 126, 234, 0.8)",
            borderRadius: 6,
            data: [
              thongKe.diemA_Plus,
              thongKe.diemA,
              thongKe.diemB_Plus,
              thongKe.diemB,
              thongKe.diemC_Plus,
              thongKe.diemC,
              thongKe.diemD_Plus,
              thongKe.diemD,
              thongKe.diemF,
            ],
          },
        ],
      }
    : null;

  return (
    <DashboardLayout>
      <h3 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2">
        <BarChart3 className="text-primary" /> Thống kê Phổ Điểm
      </h3>

      <div className="row g-4">
        {/* CỘT TRÁI: DANH SÁCH LỚP DẠY */}
        <div className="col-md-4 col-lg-3">
          <div className="card shadow-sm border-0 rounded-4 bg-white p-3 h-100">
            <h6 className="fw-bold text-muted mb-3 px-2 text-uppercase small">
              Lớp đang phụ trách
            </h6>
            <div className="d-flex flex-column gap-2">
              {lopHocList.length === 0 && (
                <div className="text-muted text-center py-4">
                  Chưa có lớp nào
                </div>
              )}
              {lopHocList.map((lh) => (
                <button
                  key={lh.maLopHoc}
                  className={`btn text-start py-3 px-3 rounded-3 fw-bold transition-all ${
                    selectedLop?.maLopHoc === lh.maLopHoc
                      ? "btn-primary shadow-sm"
                      : "btn-light text-dark hover-shadow border-0"
                  }`}
                  onClick={() => handleSelectLop(lh)}
                >
                  {lh.monHoc?.tenMonHoc} <br />{" "}
                  <small className="fw-normal opacity-75">
                    Mã lớp: #{lh.maLopHoc}
                  </small>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: BIỂU ĐỒ */}
        <div className="col-md-8 col-lg-9">
          {thongKe ? (
            <div className="card shadow-sm border-0 rounded-4 bg-white p-4 p-md-5 h-100">
              <h5 className="fw-bold text-dark mb-4">
                Phổ điểm tổng kết lớp:{" "}
                <span className="text-primary">
                  {selectedLop.monHoc?.tenMonHoc}
                </span>
              </h5>

              <div className="row text-center mb-4 border-bottom pb-4">
                <div className="col-4 border-end">
                  <div className="text-muted small fw-bold text-uppercase">
                    Tổng số Sinh viên
                  </div>
                  <h3 className="fw-bold mb-0 text-dark mt-2">
                    {thongKe.tongSoSinhVien}
                  </h3>
                </div>
                <div className="col-4 border-end">
                  <div className="text-muted small fw-bold text-uppercase">
                    {"Tỉ lệ Đạt (>= 4.0)"}
                  </div>
                  <h3 className="fw-bold mb-0 text-success mt-2">
                    {thongKe.tiLeDat}%
                  </h3>
                </div>
                <div className="col-4">
                  <div className="text-muted small fw-bold text-uppercase">
                    Số SV thi lại (Điểm F)
                  </div>
                  <h3 className="fw-bold mb-0 text-danger mt-2">
                    {thongKe.diemF}
                  </h3>
                </div>
              </div>

              <div style={{ height: "350px", width: "100%" }}>
                <Bar
                  data={chartData}
                  options={{
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                      y: { beginAtZero: true, ticks: { precision: 0 } },
                      x: { grid: { display: false } },
                    },
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="card shadow-sm border-0 rounded-4 bg-white p-5 text-center d-flex flex-column justify-content-center align-items-center h-100">
              <div className="display-1 opacity-25 mb-3 text-primary">
                <BarChart3 size={80} />
              </div>
              <h4 className="text-muted fw-bold">Vui lòng chọn lớp học</h4>
              <p className="text-muted">
                Chọn một lớp học ở danh sách bên trái để xem biểu đồ phổ điểm.
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
