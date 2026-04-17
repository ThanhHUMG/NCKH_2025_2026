import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import axiosClient from "../../api/axiosClient";

export default function DiemPage() {
  const [monThiList, setMonThiList] = useState([]);
  const [selectedMonThi, setSelectedMonThi] = useState(null);
  const [studentData, setStudentData] = useState([]);

  // ================= LOAD TẤT CẢ MÔN THI CHO ADMIN =================
  useEffect(() => {
    // Admin dùng endpoint này để lấy toàn bộ môn thi
    axiosClient.get("/api/mon-thi").then((res) => setMonThiList(res.data));
  }, []);

  // ================= CHỌN MÔN THI & LOAD DANH SÁCH SV =================
  const handleSelectMonThi = async (maMonThi) => {
    if (!maMonThi) {
      setSelectedMonThi(null);
      setStudentData([]);
      return;
    }

    const mt = monThiList.find((m) => m.maMonThi === Number(maMonThi));
    setSelectedMonThi(mt);

    try {
      // 1. Lấy toàn bộ SV trong lớp học của môn thi này
      const resSV = await axiosClient.get(`/api/mon-thi/${maMonThi}/sinh-vien`);
      // 2. Lấy điểm của các SV (Dùng API lấy điểm chung của hệ thống)
      const resDiem = await axiosClient.get(
        `/api/diem-thi/mon-thi/${maMonThi}`,
      );

      // 3. Gộp dữ liệu: SV nào có điểm thì gắn vào, chưa có thì để null
      const merged = resSV.data.map((sv) => {
        const diem = resDiem.data.find((d) => d.sinhVien?.msv === sv.msv);
        return { ...sv, diemObj: diem || null };
      });
      setStudentData(merged);
    } catch (error) {
      alert("Lỗi khi tải danh sách sinh viên hoặc điểm!");
    }
  };

  // ================= NHẬP / SỬA ĐIỂM =================
  const handleNhapSuaDiem = async (sv) => {
    const a = prompt(
      `Nhập điểm CUỐI KỲ (60%) cho SV ${sv.hoTen}:`,
      sv.diemObj?.diemA ?? "",
    );
    if (a === null) return;

    const b = prompt(
      `Nhập điểm GIỮA KỲ / KIỂM TRA (30%) cho SV ${sv.hoTen}:`,
      sv.diemObj?.diemB ?? "",
    );
    if (b === null) return;

    const c = prompt(
      `Nhập điểm CHUYÊN CẦN (10%) cho SV ${sv.hoTen}:`,
      sv.diemObj?.diemC ?? "",
    );
    if (c === null) return;

    try {
      // Admin gọi thẳng vào DiemThiController (không dùng qua nhánh /teacher)
      await axiosClient.post(
        `/api/diem-thi/mon-thi/${selectedMonThi.maMonThi}/nhap-diem`,
        {
          msv: sv.msv,
          diemA: Number(a),
          diemB: Number(b),
          diemC: Number(c),
        },
      );
      alert("Cập nhật điểm thành công!");
      handleSelectMonThi(selectedMonThi.maMonThi); // Tải lại bảng ngay lập tức
    } catch (err) {
      alert("Lỗi nhập điểm: Vui lòng nhập số hợp lệ từ 0 - 10");
    }
  };

  // ================= XOÁ ĐIỂM =================
  const handleXoaDiem = async (idDiem) => {
    if (
      window.confirm(
        "Admin: Bạn có chắc chắn muốn xoá vĩnh viễn điểm của sinh viên này?",
      )
    ) {
      try {
        await axiosClient.delete(`/api/diem-thi/${idDiem}`);
        alert("Đã xoá điểm!");
        handleSelectMonThi(selectedMonThi.maMonThi); // Tải lại bảng
      } catch (err) {
        alert("Lỗi khi xoá điểm!");
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="card shadow-sm p-4">
        <h3 className="mb-4 text-primary">
          👑 Admin - Quản lý Điểm thi Toàn trường
        </h3>

        <div className="mb-4 w-50">
          <label className="form-label fw-bold">
            Chọn môn thi để quản lý điểm:
          </label>
          <select
            className="form-select border-primary"
            onChange={(e) => handleSelectMonThi(e.target.value)}
          >
            <option value="">-- Vui lòng chọn môn thi --</option>
            {monThiList.map((mt) => (
              <option key={mt.maMonThi} value={mt.maMonThi}>
                {mt.tenMonThi} - Lớp: {mt.lopHoc?.maLopHoc} (Phòng:{" "}
                {mt.phongThi})
              </option>
            ))}
          </select>
        </div>

        {selectedMonThi && (
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-primary text-dark">
              <tr className="text-center">
                <th>MSV</th>
                <th>Họ tên</th>
                <th title="Trọng số 60%">Cuối kỳ (A)</th>
                <th title="Trọng số 30%">Giữa kỳ (B)</th>
                <th title="Trọng số 10%">Chuyên cần (C)</th>
                <th>Hệ 10</th>
                <th>Điểm Chữ</th>
                <th>Thao tác (Admin)</th>
              </tr>
            </thead>
            <tbody>
              {studentData.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center text-muted">
                    Lớp này chưa có sinh viên nào.
                  </td>
                </tr>
              ) : (
                studentData.map((item) => (
                  <tr key={item.msv} className="text-center">
                    <td className="fw-bold">{item.msv}</td>
                    <td className="text-start">{item.hoTen}</td>
                    <td className="text-primary fw-bold">
                      {item.diemObj?.diemA ?? "-"}
                    </td>
                    <td className="text-primary fw-bold">
                      {item.diemObj?.diemB ?? "-"}
                    </td>
                    <td className="text-primary fw-bold">
                      {item.diemObj?.diemC ?? "-"}
                    </td>
                    <td className="text-danger fw-bold">
                      {item.diemObj?.diemTb ?? "-"}
                    </td>
                    <td className="text-danger fw-bold fs-5">
                      {item.diemObj?.diemChu ?? "-"}
                    </td>

                    <td>
                      <button
                        className="btn btn-sm btn-warning me-2 fw-bold"
                        onClick={() => handleNhapSuaDiem(item)}
                      >
                        {item.diemObj ? "Sửa" : "Nhập điểm"}
                      </button>
                      {item.diemObj && (
                        <button
                          className="btn btn-sm btn-outline-danger fw-bold"
                          onClick={() => handleXoaDiem(item.diemObj.id)}
                        >
                          Xoá
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
}
