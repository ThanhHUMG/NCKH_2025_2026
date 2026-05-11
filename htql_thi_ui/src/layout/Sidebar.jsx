import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Layers,
  CalendarDays,
  ClipboardList,
  GraduationCap,
  PenTool,
} from "lucide-react";

export default function Sidebar() {
  const { role } = useAuth();
  const linkClass = ({ isActive }) =>
    `list-group-item list-group-item-action d-flex align-items-center gap-3 border-0 rounded-3 mb-1 fw-medium ${isActive ? "active shadow-sm" : "text-muted hover-bg-light"}`;

  return (
    <div
      className="bg-white border-end shadow-sm"
      style={{
        width: 280,
        minHeight: "calc(100vh - 60px)",
        position: "sticky",
        top: "60px",
        overflowY: "auto",
      }}
    >
      <div className="list-group p-3">
        <div className="small fw-bold text-uppercase text-muted mb-2 px-3">
          Menu Chính
        </div>

        {role === "ADMIN" && (
          <>
            <NavLink to="/admin" className={linkClass} end>
              <LayoutDashboard size={20} /> Tổng quan
            </NavLink>
            <div className="small fw-bold text-uppercase text-muted mt-3 mb-2 px-3">
              Tài Khoản
            </div>
            <NavLink to="/admin/user-manage" className={linkClass}>
              <Users size={20} /> Quản lý User
            </NavLink>
            <div className="small fw-bold text-uppercase text-muted mt-3 mb-2 px-3">
              Danh mục
            </div>
            <NavLink to="/admin/khoa" className={linkClass}>
              <Layers size={20} /> Khoa
            </NavLink>
            <NavLink to="/admin/mon-hoc" className={linkClass}>
              <BookOpen size={20} /> Môn Học
            </NavLink>
            <NavLink to="/admin/hoc-ky" className={linkClass}>
              <CalendarDays size={20} /> Học Kỳ
            </NavLink>
            <NavLink to="/admin/giao-vien" className={linkClass}>
              <PenTool size={20} /> Giáo Viên
            </NavLink>
            <NavLink to="/admin/sinh-vien" className={linkClass}>
              <GraduationCap size={20} /> Sinh Viên
            </NavLink>
            <div className="small fw-bold text-uppercase text-muted mt-3 mb-2 px-3">
              Đào tạo & Thi
            </div>
            <NavLink to="/admin/lop-hoc" className={linkClass}>
              <Users size={20} /> Lớp Học
            </NavLink>
            <NavLink to="/admin/ki-thi" className={linkClass}>
              <ClipboardList size={20} /> Kỳ Thi
            </NavLink>
            <NavLink to="/admin/lich-thi" className={linkClass}>
              <CalendarDays size={20} /> Lịch Thi
            </NavLink>
            <NavLink to="/admin/diem" className={linkClass}>
              <PenTool size={20} /> Điểm Thi Tổng Hợp
            </NavLink>
          </>
        )}

        {role === "TEACHER" && (
          <>
            <NavLink to="/teacher" className={linkClass} end>
              <LayoutDashboard size={20} /> Lớp Giảng Dạy
            </NavLink>
            <NavLink to="/teacher/nhap-diem" className={linkClass}>
              <PenTool size={20} /> Nhập Điểm Quá Trình
            </NavLink>
            <NavLink to="/teacher/xem-diem" className={linkClass}>
              <ClipboardList size={20} /> Thống Kê Phổ Điểm
            </NavLink>
          </>
        )}

        {role === "STUDENT" && (
          <NavLink to="/student" className={linkClass}>
            <GraduationCap size={20} /> Hồ sơ & Điểm số
          </NavLink>
        )}
      </div>
    </div>
  );
}
