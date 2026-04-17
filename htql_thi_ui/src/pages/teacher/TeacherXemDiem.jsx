import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import axiosClient from "../../api/axiosClient";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

export default function TeacherXemDiem() {
  const [monThiList, setMonThiList] = useState([]);
  const [scores, setScores] = useState([]);
  const [selectedMon, setSelectedMon] = useState(null);

  useEffect(() => {
    axiosClient
      .get("/api/teacher/mon-thi")
      .then((res) => setMonThiList(res.data));
  }, []);

  const handleSelectMon = async (mt) => {
    setSelectedMon(mt);
    try {
      // Chỉ lấy những sinh viên ĐÃ CÓ ĐIỂM để vẽ thống kê
      const res = await axiosClient.get(
        `/api/teacher/mon-thi/${mt.maMonThi}/scores`,
      );
      setScores(res.data);
    } catch (error) {
      alert("Lỗi tải dữ liệu điểm!");
    }
  };

  // Cấu hình dữ liệu cho Chart.js
  const chartData = {
    labels: ["A+", "A", "B+", "B", "C+", "C", "D+", "D", "F"],
    datasets: [
      {
        label: "Số lượng sinh viên",
        backgroundColor: "rgba(54, 162, 235, 0.7)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
        // Lọc số lượng sinh viên theo từng thang điểm chữ
        data: ["A+", "A", "B+", "B", "C+", "C", "D+", "D", "F"].map(
          (grade) => scores.filter((s) => s.diemChu === grade).length,
        ),
      },
    ],
  };

  return (
    <DashboardLayout>
      <div className="row">
        <div className="col-md-3">
          <div className="card shadow-sm border-primary">
            <div className="card-header bg-primary text-white fw-bold">
              Danh sách môn dạy
            </div>
            <ul className="list-group list-group-flush">
              {monThiList.length === 0 && (
                <li className="list-group-item text-muted">Trống</li>
              )}
              {monThiList.map((mt) => (
                <button
                  key={mt.maMonThi}
                  className={`list-group-item list-group-item-action ${selectedMon?.maMonThi === mt.maMonThi ? "active" : ""}`}
                  onClick={() => handleSelectMon(mt)}
                >
                  {mt.tenMonThi}
                </button>
              ))}
            </ul>
          </div>
        </div>

        <div className="col-md-9">
          {selectedMon ? (
            <div className="card shadow-sm p-4">
              <h4 className="mb-4 text-primary">
                📊 Thống kê điểm môn: {selectedMon.tenMonThi}
              </h4>

              {/* Vùng vẽ biểu đồ */}
              <div style={{ height: "350px", marginBottom: "30px" }}>
                <Bar
                  data={chartData}
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      title: { display: true, text: "Phổ điểm sinh viên" },
                      legend: { display: false },
                    },
                  }}
                />
              </div>

              <hr />
              <h5 className="mt-3">
                Danh sách bảng điểm chi tiết ({scores.length} sinh viên đã nhập
                điểm)
              </h5>
              <table className="table table-bordered table-striped mt-3 align-middle">
                <thead className="table-dark text-center">
                  <tr>
                    <th>MSV</th>
                    <th>Họ tên</th>
                    <th>Điểm TB</th>
                    <th>Điểm Chữ</th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {scores.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center text-muted">
                        Chưa có dữ liệu điểm môn này.
                      </td>
                    </tr>
                  ) : (
                    scores.map((s) => (
                      <tr key={s.id}>
                        <td>{s.sinhVien?.msv}</td>
                        <td className="text-start">{s.sinhVien?.hoTen}</td>
                        <td className="fw-bold">{s.diemTb}</td>
                        <td className="fw-bold text-danger fs-5">
                          {s.diemChu}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="alert alert-info">
              👈 Vui lòng chọn một môn học ở danh sách bên trái để xem thống kê.
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
