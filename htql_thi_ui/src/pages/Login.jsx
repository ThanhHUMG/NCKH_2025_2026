import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext"; // [cite: 709]
import { Eye, EyeOff, LogIn, ShieldCheck } from "lucide-react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth(); // [cite: 706]
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const role = await login(username, password); // [cite: 706]
      if (role === "ADMIN") navigate("/admin");
      else if (role === "TEACHER") navigate("/teacher");
      else if (role === "STUDENT") navigate("/student");
    } catch (err) {
      setError("Tài khoản hoặc mật khẩu không chính xác!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center min-vh-100"
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <div
        className="card shadow-lg border-0 rounded-4"
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "rgba(255, 255, 255, 0.95)",
        }}
      >
        <div className="card-body p-5">
          <div className="text-center mb-4">
            <div className="text-primary mb-2">
              <ShieldCheck size={48} strokeWidth={2.5} />
            </div>
            <h2 className="fw-bold text-dark mb-1">HTQL THI</h2>
            <p className="text-muted small">Vui lòng đăng nhập hệ thống</p>
          </div>

          {error && (
            <div className="alert alert-danger border-0 small text-center py-2">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label small fw-bold text-muted">
                Tên đăng nhập
              </label>
              <input
                type="text"
                className="form-control form-control-lg rounded-3 fs-6"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label small fw-bold text-muted">
                Mật khẩu
              </label>
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control form-control-lg rounded-start-3 fs-6 border-end-0"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  className="btn border border-start-0 rounded-end-3 text-muted"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 py-2 fw-bold rounded-3 shadow d-flex align-items-center justify-content-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm"></span>
              ) : (
                <>
                  <LogIn size={20} /> Đăng Nhập
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
