import React from "react";
import { useAuth } from "../auth/AuthContext";

export default function Navbar() {
  const { logout, role } = useAuth();

  return (
    <nav className="navbar navbar-dark bg-dark px-3">
      <span className="navbar-brand">HTQL Thi</span>

      <div className="d-flex align-items-center gap-2">
        <span className="text-white">Role: {role}</span>
        <button className="btn btn-danger btn-sm" onClick={logout}>
          Logout
        </button>
      </div>
    </nav>
  );
}
