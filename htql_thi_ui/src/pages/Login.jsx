import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // Thay thế alert bằng state báo lỗi

  const { login, role } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Reset lỗi mỗi lần bấm đăng nhập
    setLoading(true);

    try {
      await login(username, password);

      // lấy role mới từ localStorage
      const savedRole = localStorage.getItem("role");

      if (savedRole === "ADMIN") navigate("/admin");
      else if (savedRole === "TEACHER") navigate("/teacher");
      else if (savedRole === "STUDENT") navigate("/student");
      else navigate("/login");
    } catch (err) {
      setError("Tên đăng nhập hoặc mật khẩu không chính xác!");
    } finally {
      // Dùng finally để đảm bảo dù lỗi hay thành công thì cũng tắt loading
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center min-vh-100"
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", // Background gradient hiện đại
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div
        className="card shadow-lg border-0 rounded-4"
        style={{
          width: "100%",
          maxWidth: "420px",
          backdropFilter: "blur(10px)",
          background: "rgba(255, 255, 255, 0.95)",
        }}
      >
        <div className="card-body p-5">
          <div className="text-center mb-4">
            <h2 className="fw-bold text-primary mb-2">Welcome Back!</h2>
            <p className="text-muted">Vui lòng đăng nhập để tiếp tục</p>
          </div>

          {/* Hiển thị lỗi xịn xò thay vì dùng Window Alert */}
          {error && (
            <div className="alert alert-danger py-2 text-center" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            {/* Floating Label cho Username */}
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control rounded-3"
                id="usernameInput"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <label htmlFor="usernameInput">Tên đăng nhập</label>
            </div>

            {/* Floating Label cho Password + Icon ẩn hiện */}
            <div className="form-floating mb-4 position-relative">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control rounded-3"
                id="passwordInput"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label htmlFor="passwordInput">Mật khẩu</label>

              {/* Nút toggle Show/Hide Password */}
              <span
                className="position-absolute top-50 end-0 translate-middle-y pe-3"
                style={{ cursor: "pointer", zIndex: 10 }}
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 py-2 rounded-3 fw-semibold shadow-sm"
              style={{
                background: "linear-gradient(to right, #667eea, #764ba2)",
                border: "none",
                transition: "all 0.3s ease",
              }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Đang xử lý...
                </>
              ) : (
                "Đăng nhập"
              )}
            </button>
          </form>

          {/* Hiển thị Role gọn gàng hơn */}
          <div className="mt-4 text-center">
            <span className="badge bg-light text-secondary border px-3 py-2">
              Role hiện tại:{" "}
              <strong className="text-primary">{role || "GUEST"}</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
