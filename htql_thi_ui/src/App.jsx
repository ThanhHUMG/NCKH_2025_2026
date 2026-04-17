import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import ProtectedRoute from "./auth/ProtectedRoute";

// home pages
import AdminHome from "./pages/admin/AdminHome";
import TeacherHome from "./pages/teacher/TeacherHome";
import StudentHome from "./pages/student/StudentHome";

// ADMIN PAGES
import AdminUserCreate from "./pages/admin/AdminUserCreate";
import UserManagePage from "./pages/admin/UserManagePage";

import SinhVienPage from "./pages/admin/SinhVienPage";
import GiaoVienPage from "./pages/admin/GiaoVienPage";
import KhoaPage from "./pages/admin/KhoaPage";
import MonHocPage from "./pages/admin/MonHocPage";
import HocKyPage from "./pages/admin/HocKyPage";
import LopHocPage from "./pages/admin/LopHocPage";
import MonThiPage from "./pages/admin/MonThiPage";
import KiThiPage from "./pages/admin/KiThiPage";
import DiemPage from "./pages/admin/DiemPage";

import TeacherNhapDiem from "./pages/teacher/TeacherNhapDiem";
import TeacherXemDiem from "./pages/teacher/TeacherXemDiem";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Login />} />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowRoles={["ADMIN"]}>
              <AdminHome />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowRoles={["ADMIN"]}>
              <AdminUserCreate />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/user-manage"
          element={
            <ProtectedRoute allowRoles={["ADMIN"]}>
              <UserManagePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/sinh-vien"
          element={
            <ProtectedRoute allowRoles={["ADMIN"]}>
              <SinhVienPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/giao-vien"
          element={
            <ProtectedRoute allowRoles={["ADMIN"]}>
              <GiaoVienPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/khoa"
          element={
            <ProtectedRoute allowRoles={["ADMIN"]}>
              <KhoaPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/mon-hoc"
          element={
            <ProtectedRoute allowRoles={["ADMIN"]}>
              <MonHocPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/hoc-ky"
          element={
            <ProtectedRoute allowRoles={["ADMIN"]}>
              <HocKyPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/lop-hoc"
          element={
            <ProtectedRoute allowRoles={["ADMIN"]}>
              <LopHocPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/mon-thi"
          element={
            <ProtectedRoute allowRoles={["ADMIN"]}>
              <MonThiPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/ki-thi"
          element={
            <ProtectedRoute allowRoles={["ADMIN"]}>
              <KiThiPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/diem"
          element={
            <ProtectedRoute allowRoles={["ADMIN"]}>
              <DiemPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher"
          element={
            <ProtectedRoute allowRoles={["TEACHER"]}>
              <TeacherHome />
            </ProtectedRoute>
          }
        />

        {/* THÊM ROUTE NHẬP ĐIỂM */}
        <Route
          path="/teacher/nhap-diem"
          element={
            <ProtectedRoute allowRoles={["TEACHER"]}>
              <TeacherNhapDiem />
            </ProtectedRoute>
          }
        />

        {/* THÊM ROUTE XEM ĐIỂM */}
        <Route
          path="/teacher/xem-diem"
          element={
            <ProtectedRoute allowRoles={["TEACHER"]}>
              <TeacherXemDiem />
            </ProtectedRoute>
          }
        />

        {/* STUDENT */}
        <Route
          path="/student"
          element={
            <ProtectedRoute allowRoles={["STUDENT"]}>
              <StudentHome />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}
