import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import axiosClient from "../../api/axiosClient";
import Pagination from "../../components/Pagination";
import { ShieldAlert, UserPlus, Trash2, KeyRound } from "lucide-react";

export default function UserManagePage() {
  const [users, setUsers] = useState([]);
  const [adminForm, setAdminForm] = useState({ username: "", password: "" });
  const [userForm, setUserForm] = useState({
    username: "",
    password: "",
    roleId: "",
    roleType: "STUDENT",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const loadUsers = async () => {
    const res = await axiosClient.get("/api/admin/user-manage");
    setUsers(res.data);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.post("/api/admin/user-manage/create-admin", adminForm);
      alert("✅ Tạo Admin thành công!");
      setAdminForm({ username: "", password: "" });
      loadUsers();
    } catch (e) {
      alert("❌ Username đã tồn tại!");
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const endpoint =
        userForm.roleType === "STUDENT"
          ? "/api/admin/users/create-student"
          : "/api/admin/users/create-teacher";
      const payload = {
        username: userForm.username,
        password: userForm.password,
        ...(userForm.roleType === "STUDENT"
          ? { msv: Number(userForm.roleId) }
          : { maGiaoVien: Number(userForm.roleId) }),
      };
      await axiosClient.post(endpoint, payload);
      alert("✅ Cấp tài khoản thành công!");
      setUserForm({
        username: "",
        password: "",
        roleId: "",
        roleType: "STUDENT",
      });
      loadUsers();
    } catch (e) {
      alert("❌ Lỗi: Username đã tồn tại hoặc ID không đúng!");
    }
  };

  const currentData = users.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <DashboardLayout>
      <h3 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2">
        <KeyRound className="text-warning" /> Quản lý Tài Khoản Hệ Thống
      </h3>

      <div className="row g-4 mb-4">
        {/* Tạo Admin */}
        <div className="col-md-6">
          <div
            className="card border-0 shadow-sm rounded-4 p-4 h-100"
            style={{ borderTop: "4px solid #dc3545" }}
          >
            <h5 className="fw-bold text-danger d-flex align-items-center gap-2 mb-3">
              <ShieldAlert size={20} /> Tạo ADMIN hệ thống
            </h5>
            <form onSubmit={handleCreateAdmin}>
              <div className="row g-2 mb-3">
                <div className="col-6">
                  <input
                    type="text"
                    className="form-control bg-light rounded-3"
                    placeholder="Username"
                    value={adminForm.username}
                    onChange={(e) =>
                      setAdminForm({ ...adminForm, username: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="col-6">
                  <input
                    type="text"
                    className="form-control bg-light rounded-3"
                    placeholder="Password"
                    value={adminForm.password}
                    onChange={(e) =>
                      setAdminForm({ ...adminForm, password: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="btn btn-danger w-100 fw-bold rounded-3"
              >
                Cấp quyền Quản Trị
              </button>
            </form>
          </div>
        </div>

        {/* Tạo SV/GV */}
        <div className="col-md-6">
          <div
            className="card border-0 shadow-sm rounded-4 p-4 h-100"
            style={{ borderTop: "4px solid #0d6efd" }}
          >
            <h5 className="fw-bold text-primary d-flex align-items-center gap-2 mb-3">
              <UserPlus size={20} /> Cấp tài khoản SV / GV
            </h5>
            <form onSubmit={handleCreateUser}>
              <div className="row g-2 mb-2">
                <div className="col-4">
                  <select
                    className="form-select bg-light rounded-3"
                    value={userForm.roleType}
                    onChange={(e) =>
                      setUserForm({ ...userForm, roleType: e.target.value })
                    }
                  >
                    <option value="STUDENT">Sinh Viên</option>
                    <option value="TEACHER">Giáo Viên</option>
                  </select>
                </div>
                <div className="col-8">
                  <input
                    type="number"
                    className="form-control bg-light rounded-3"
                    placeholder={
                      userForm.roleType === "STUDENT"
                        ? "Nhập MSV"
                        : "Nhập Mã GV"
                    }
                    value={userForm.roleId}
                    onChange={(e) =>
                      setUserForm({ ...userForm, roleId: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="row g-2 mb-3">
                <div className="col-6">
                  <input
                    type="text"
                    className="form-control bg-light rounded-3"
                    placeholder="Username"
                    value={userForm.username}
                    onChange={(e) =>
                      setUserForm({ ...userForm, username: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="col-6">
                  <input
                    type="text"
                    className="form-control bg-light rounded-3"
                    placeholder="Password"
                    value={userForm.password}
                    onChange={(e) =>
                      setUserForm({ ...userForm, password: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="btn btn-primary w-100 fw-bold rounded-3"
              >
                Cấp tài khoản
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4 p-4">
        <h5 className="fw-bold mb-3">Danh sách Tài khoản</h5>
        <table className="table table-hover align-middle text-center mb-0">
          <thead className="table-light small text-uppercase">
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Phân Quyền</th>
              <th className="text-start">Chủ Sở Hữu</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((u) => (
              <tr key={u.id}>
                <td className="fw-bold text-secondary">#{u.id}</td>
                <td className="fw-bold text-dark">{u.username}</td>
                <td>
                  <span
                    className={`badge px-3 py-2 rounded-pill ${u.role === "ADMIN" ? "bg-danger" : u.role === "TEACHER" ? "bg-warning text-dark" : "bg-info text-dark"}`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="text-start small fw-medium">
                  {u.giaoVien && `GV: ${u.giaoVien.hoTen}`}
                  {u.sinhVien && `SV: ${u.sinhVien.hoTen}`}
                  {!u.giaoVien && !u.sinhVien && (
                    <span className="text-muted">Hệ thống</span>
                  )}
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-light text-danger border"
                    onClick={async () => {
                      if (window.confirm("Xóa tài khoản này?")) {
                        await axiosClient.delete(
                          `/api/admin/user-manage/${u.id}`,
                        );
                        loadUsers();
                      }
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination
          currentPage={currentPage}
          totalItems={users.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </DashboardLayout>
  );
}
