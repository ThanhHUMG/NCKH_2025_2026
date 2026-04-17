import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import axiosClient from "../../api/axiosClient";

export default function UserManagePage() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ username: "", password: "" });

  const loadUsers = async () => {
    const res = await axiosClient.get("/api/admin/user-manage");
    setUsers(res.data);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const getRoleBadge = (role) => {
    if (role === "ADMIN")
      return <span className="badge bg-danger">Quản trị viên</span>;
    if (role === "TEACHER")
      return <span className="badge bg-warning text-dark">Giáo viên</span>;
    return <span className="badge bg-info text-dark">Sinh viên</span>;
  };

  return (
    <DashboardLayout>
      <h3 className="text-primary fw-bold mb-4">
        🔑 Quản lý Tài khoản Hệ thống
      </h3>
      <div className="card shadow-sm border-0 p-4 mb-4 bg-light">
        <h5 className="fw-bold text-dark mb-3">🛡️ Tạo tài khoản ADMIN mới</h5>
        <div className="d-flex gap-2">
          <input
            className="form-control"
            placeholder="Tên đăng nhập"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
          <input
            className="form-control"
            type="password"
            placeholder="Mật khẩu"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button
            className="btn btn-danger px-4 fw-bold"
            onClick={async () => {
              await axiosClient.post(
                "/api/admin/user-manage/create-admin",
                form,
              );
              alert("✅ Tạo Admin thành công!");
              loadUsers();
            }}
          >
            Tạo ngay
          </button>
        </div>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          <table className="table table-hover align-middle text-center mb-0">
            <thead className="table-secondary">
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Vai trò</th>
                <th>Liên kết</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>#{u.id}</td>
                  <td className="fw-bold">{u.username}</td>
                  <td>{getRoleBadge(u.role)}</td>
                  <td>
                    {u.giaoVien && (
                      <small className="text-muted">
                        GV: {u.giaoVien.hoTen}
                      </small>
                    )}
                    {u.sinhVien && (
                      <small className="text-muted">
                        SV: {u.sinhVien.hoTen}
                      </small>
                    )}
                    {!u.giaoVien && !u.sinhVien && (
                      <span className="text-muted small italic">Hệ thống</span>
                    )}
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={async () => {
                        if (window.confirm("Xóa user?")) {
                          await axiosClient.delete(
                            `/api/admin/user-manage/${u.id}`,
                          );
                          loadUsers();
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
    </DashboardLayout>
  );
}
