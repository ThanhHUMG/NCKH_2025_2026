import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, role } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(username, password);

      // lấy role mới từ localStorage (đảm bảo chắc chắn)
      const savedRole = localStorage.getItem("role");

      if (savedRole === "ADMIN") navigate("/admin");
      else if (savedRole === "TEACHER") navigate("/teacher");
      else if (savedRole === "STUDENT") navigate("/student");
      else navigate("/login");
    } catch (err) {
      alert("Sai tài khoản hoặc mật khẩu!");
    }

    setLoading(false);
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 400 }}>
      <div className="card p-4 shadow">
        <h3 className="text-center mb-3">Đăng nhập</h3>

        <form onSubmit={handleLogin}>
          <input
            className="form-control mb-3"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            className="form-control mb-3"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Login"}
          </button>
        </form>

        <div className="mt-3 text-muted text-center">Role hiện tại: {role}</div>
      </div>
    </div>
  );
}
