import React from "react";
import { useAuth } from "../auth/AuthContext";
import { LogOut, UserCircle } from "lucide-react";

export default function Navbar() {
  const { logout, role } = useAuth();
  return (
    <nav
      className="navbar navbar-expand-lg bg-white border-bottom shadow-sm px-4 py-2 sticky-top"
      style={{ zIndex: 1000 }}
    >
      <div className="container-fluid">
        <span className="navbar-brand fw-bold text-primary d-flex align-items-center gap-2">
          <div
            className="bg-primary text-white rounded-3 d-flex align-items-center justify-content-center"
            style={{ width: 36, height: 36 }}
          >
            🏫
          </div>
          HTQL THI
        </span>
        <div className="d-flex align-items-center gap-3">
          <div className="d-flex align-items-center gap-2 text-muted fw-medium bg-light px-3 py-1 rounded-pill">
            <UserCircle size={18} /> Role:{" "}
            <span className="text-dark">{role}</span>
          </div>
          <button
            className="btn btn-danger rounded-circle p-2 shadow-sm d-flex align-items-center justify-content-center"
            onClick={logout}
            title="Đăng xuất"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </nav>
  );
}
