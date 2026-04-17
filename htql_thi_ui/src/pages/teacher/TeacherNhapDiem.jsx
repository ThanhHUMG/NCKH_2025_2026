import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import axiosClient from "../../api/axiosClient";

export default function TeacherNhapDiem() {
  const [monThiList, setMonThiList] = useState([]);
  const [selectedMonThi, setSelectedMonThi] = useState(null);
  const [studentData, setStudentData] = useState([]);

  useEffect(() => {
    axiosClient
      .get("/api/teacher/mon-thi")
      .then((res) => setMonThiList(res.data));
  }, []);

  const handleSelectMonThi = async (maMonThi) => {
    if (!maMonThi) {
      setSelectedMonThi(null);
      setStudentData([]);
      return;
    }

    const mt = monThiList.find((m) => m.maMonThi === Number(maMonThi));
    setSelectedMonThi(mt);

    try {
      const resSV = await axiosClient.get(`/api/mon-thi/${maMonThi}/sinh-vien`);
      const resDiem = await axiosClient.get(
        `/api/teacher/mon-thi/${maMonThi}/scores`,
      );

      const merged = resSV.data.map((sv) => {
        const diem = resDiem.data.find((d) => d.sinhVien?.msv === sv.msv);
        return { ...sv, diemObj: diem || null };
      });
      setStudentData(merged);
    } catch (error) {
      alert("Lỗi khi tải danh sách sinh viên hoặc điểm!");
    }
  };

  const handleNhapSuaDiem = async (sv) => {
    // Đổi lại label prompt cho đúng trọng số
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
      await axiosClient.post(
        `/api/teacher/mon-thi/${selectedMonThi.maMonThi}/nhap-diem`,
        {
          msv: sv.msv,
          diemA: Number(a),
          diemB: Number(b),
          diemC: Number(c),
        },
      );
      alert("Cập nhật điểm thành công!");
      handleSelectMonThi(selectedMonThi.maMonThi);
    } catch (err) {
      alert("Lỗi nhập điểm: Vui lòng nhập số từ 0 - 10");
    }
  };

  const handleXoaDiem = async (idDiem) => {
    if (window.confirm("Bạn có chắc chắn muốn xoá điểm của sinh viên này?")) {
      try {
        await axiosClient.delete(`/api/diem-thi/${idDiem}`);
        alert("Đã xoá điểm!");
        handleSelectMonThi(selectedMonThi.maMonThi);
      } catch (err) {
        alert("Lỗi khi xoá điểm!");
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="card shadow-sm p-4">
        <h3 className="mb-4 text-success">✍️ Quản lý & Nhập điểm</h3>

        <div className="mb-4 w-50">
          <label className="form-label fw-bold">
            Chọn môn thi để nhập điểm:
          </label>
          <select
            className="form-select"
            onChange={(e) => handleSelectMonThi(e.target.value)}
          >
            <option value="">-- Vui lòng chọn môn thi --</option>
            {monThiList.map((mt) => (
              <option key={mt.maMonThi} value={mt.maMonThi}>
                {mt.tenMonThi} (Phòng: {mt.phongThi})
              </option>
            ))}
          </select>
        </div>

        {selectedMonThi && (
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-dark">
              <tr className="text-center">
                <th>MSV</th>
                <th>Họ tên</th>
                <th title="Trọng số 60%">Cuối kỳ (A)</th>
                <th title="Trọng số 30%">Giữa kỳ (B)</th>
                <th title="Trọng số 10%">Chuyên cần (C)</th>
                <th>Hệ 10</th>
                <th>Điểm Chữ</th>
                <th>Thao tác</th>
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
                    <td>{item.msv}</td>
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
                    {/* 👇 CỘT ĐIỂM CHỮ THÊM MỚI 👇 */}
                    <td className="text-danger fw-bold fs-5">
                      {item.diemObj?.diemChu ?? "-"}
                    </td>

                    <td>
                      <button
                        className="btn btn-sm btn-primary me-2"
                        onClick={() => handleNhapSuaDiem(item)}
                      >
                        {item.diemObj ? "Sửa" : "Nhập điểm"}
                      </button>
                      {item.diemObj && (
                        <button
                          className="btn btn-sm btn-outline-danger"
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
