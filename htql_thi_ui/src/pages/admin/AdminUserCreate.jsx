import React, { useState } from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import axiosClient from "../../api/axiosClient";

export default function AdminUserCreate() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    msv: "",
    maGiaoVien: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleCreate = async (endpoint, payload) => {
    setMessage({ type: "", text: "" });
    try {
      await axiosClient.post(endpoint, payload);
      setMessage({ type: "success", text: "✅ Tạo tài khoản thành công!" });
    } catch (e) {
      setMessage({
        type: "danger",
        text: "❌ Lỗi: Username đã tồn tại hoặc mã ID không đúng!",
      });
    }
  };

  return (
    <DashboardLayout>
      <h3 className="text-primary fw-bold mb-4">🔐 Cấp tài khoản Hệ thống</h3>
      {message.text && (
        <div className={`alert alert-${message.type} shadow-sm`}>
          {message.text}
        </div>
      )}

      <div className="card shadow-sm border-0 mb-4 bg-light p-4">
        <h5 className="fw-bold mb-3">Thông tin đăng nhập chung</h5>
        <div className="row">
          <div className="col-md-6 mb-2">
            <input
              className="form-control"
              placeholder="Tên đăng nhập"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
          </div>
          <div className="col-md-6 mb-2">
            <input
              className="form-control"
              type="password"
              placeholder="Mật khẩu"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="card shadow-sm border-top border-success border-4 h-100">
            <div className="card-body">
              <h5 className="text-success fw-bold">🎓 Tài khoản Sinh viên</h5>
              <p className="small text-muted">
                Liên kết tài khoản với mã sinh viên (MSV)
              </p>
              <input
                className="form-control mb-3"
                placeholder="Nhập MSV"
                value={form.msv}
                onChange={(e) => setForm({ ...form, msv: e.target.value })}
              />
              <button
                className="btn btn-success w-100 fw-bold"
                onClick={() =>
                  handleCreate("/api/admin/users/create-student", {
                    username: form.username,
                    password: form.password,
                    msv: Number(form.msv),
                  })
                }
              >
                Tạo cho Sinh viên
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow-sm border-top border-warning border-4 h-100">
            <div className="card-body">
              <h5 className="text-warning text-darken fw-bold">
                👨‍🏫 Tài khoản Giáo viên
              </h5>
              <p className="small text-muted">
                Liên kết tài khoản với mã giáo viên (MGV)
              </p>
              <input
                className="form-control mb-3"
                placeholder="Nhập Mã giáo viên"
                value={form.maGiaoVien}
                onChange={(e) =>
                  setForm({ ...form, maGiaoVien: e.target.value })
                }
              />
              <button
                className="btn btn-warning w-100 fw-bold"
                onClick={() =>
                  handleCreate("/api/admin/users/create-teacher", {
                    username: form.username,
                    password: form.password,
                    maGiaoVien: Number(form.maGiaoVien),
                  })
                }
              >
                Tạo cho Giáo viên
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
