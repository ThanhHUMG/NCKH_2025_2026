import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./auth/ProtectedRoute"; // [cite: 710]
import Login from "./pages/Login";

// Admin Pages
import AdminHome from "./pages/admin/AdminHome";
import KhoaPage from "./pages/admin/KhoaPage";
import HocKyPage from "./pages/admin/HocKyPage";
import MonHocPage from "./pages/admin/MonHocPage";
import UserManagePage from "./pages/admin/UserManagePage";
import SinhVienPage from "./pages/admin/SinhVienPage";
import GiaoVienPage from "./pages/admin/GiaoVienPage";
import LopHocPage from "./pages/admin/LopHocPage";
import KiThiPage from "./pages/admin/KiThiPage";
import LichThiPage from "./pages/admin/LichThiPage";
import DiemPage from "./pages/admin/DiemPage";

// Teacher & Student
import TeacherHome from "./pages/teacher/TeacherHome";
import TeacherNhapDiem from "./pages/teacher/TeacherNhapDiem";
import TeacherXemDiem from "./pages/teacher/TeacherXemDiem";
import StudentHome from "./pages/student/StudentHome";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />

        {/* ADMIN ROUTES */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowRoles={["ADMIN"]}>
              <AdminHome />
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
          path="/admin/khoa"
          element={
            <ProtectedRoute allowRoles={["ADMIN"]}>
              <KhoaPage />
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
          path="/admin/mon-hoc"
          element={
            <ProtectedRoute allowRoles={["ADMIN"]}>
              <MonHocPage />
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
          path="/admin/lop-hoc"
          element={
            <ProtectedRoute allowRoles={["ADMIN"]}>
              <LopHocPage />
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
          path="/admin/lich-thi"
          element={
            <ProtectedRoute allowRoles={["ADMIN"]}>
              <LichThiPage />
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

        {/* TEACHER ROUTES */}
        <Route
          path="/teacher"
          element={
            <ProtectedRoute allowRoles={["TEACHER"]}>
              <TeacherHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/nhap-diem"
          element={
            <ProtectedRoute allowRoles={["TEACHER"]}>
              <TeacherNhapDiem />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/xem-diem"
          element={
            <ProtectedRoute allowRoles={["TEACHER"]}>
              <TeacherXemDiem />
            </ProtectedRoute>
          }
        />
        {/* STUDENT ROUTES */}
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
