import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Sidebar() {
  const { role } = useAuth();

  const linkClass = ({ isActive }) =>
    "list-group-item list-group-item-action " + (isActive ? "active" : "");

  return (
    <div
      className="border-end bg-light"
      style={{ width: 270, minHeight: "100vh" }}
    >
      <div className="p-3 border-bottom">
        <h5 className="m-0">Dashboard</h5>
        <small className="text-muted">Role: {role}</small>
      </div>

      <div className="list-group list-group-flush">
        {/* ADMIN */}
        {role === "ADMIN" && (
          <>
            <NavLink to="/admin" className={linkClass}>
              Trang chủ Admin
            </NavLink>

            <NavLink to="/admin/users" className={linkClass}>
              Tạo User GV/SV
            </NavLink>

            <NavLink to="/admin/user-manage" className={linkClass}>
              Quản lý User
            </NavLink>

            <NavLink to="/admin/sinh-vien" className={linkClass}>
              Quản lý Sinh Viên
            </NavLink>

            <NavLink to="/admin/giao-vien" className={linkClass}>
              Quản lý Giáo Viên
            </NavLink>

            <NavLink to="/admin/khoa" className={linkClass}>
              Quản lý Khoa
            </NavLink>

            <NavLink to="/admin/mon-hoc" className={linkClass}>
              Quản lý Môn Học
            </NavLink>

            <NavLink to="/admin/hoc-ky" className={linkClass}>
              Quản lý Học Kỳ
            </NavLink>

            <NavLink to="/admin/lop-hoc" className={linkClass}>
              Quản lý Lớp Học
            </NavLink>

            <NavLink to="/admin/mon-thi" className={linkClass}>
              Quản lý Môn Thi
            </NavLink>

            <NavLink to="/admin/ki-thi" className={linkClass}>
              Quản lý Kỳ Thi
            </NavLink>
            <NavLink to="/admin/diem" className={linkClass}>
              Quản lý Điểm
            </NavLink>
          </>
        )}

        {/* TEACHER */}
        {role === "TEACHER" && (
          <>
            <NavLink to="/teacher" className={linkClass}>
              Lớp tôi dạy
            </NavLink>

            <NavLink to="/teacher/nhap-diem" className={linkClass}>
              Nhập điểm
            </NavLink>

            <NavLink to="/teacher/xem-diem" className={linkClass}>
              Xem & thống kê
            </NavLink>
          </>
        )}

        {/* STUDENT */}
        {role === "STUDENT" && (
          <>
            <NavLink to="/student" className={linkClass}>
              Thông tin + Điểm của tôi
            </NavLink>
          </>
        )}
      </div>
    </div>
  );
}
