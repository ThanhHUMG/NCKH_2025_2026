import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import axiosClient from "../../api/axiosClient";
import { Link } from "react-router-dom";

export default function AdminHome() {
  const [stats, setStats] = useState({ sv: 0, gv: 0, lh: 0, kt: 0 });

  useEffect(() => {
    // Gọi đồng thời các API để lấy số lượng thống kê
    const loadStats = async () => {
      try {
        const [sv, gv, lh, kt] = await Promise.all([
          axiosClient.get("/api/sinh-vien"),
          axiosClient.get("/api/giao-vien"),
          axiosClient.get("/api/lop-hoc"),
          axiosClient.get("/api/ki-thi"),
        ]);
        setStats({
          sv: sv.data.length,
          gv: gv.data.length,
          lh: lh.data.length,
          kt: kt.data.length,
        });
      } catch (e) {
        console.error("Lỗi tải thống kê");
      }
    };
    loadStats();
  }, []);

  const cardData = [
    {
      title: "Sinh viên",
      count: stats.sv,
      color: "primary",
      icon: "🎓",
      link: "/admin/sinh-vien",
    },
    {
      title: "Giáo viên",
      count: stats.gv,
      color: "success",
      icon: "👨‍🏫",
      link: "/admin/giao-vien",
    },
    {
      title: "Lớp học",
      count: stats.lh,
      color: "warning text-dark",
      icon: "🏫",
      link: "/admin/lop-hoc",
    },
    {
      title: "Kỳ thi",
      count: stats.kt,
      color: "danger",
      icon: "🏆",
      link: "/admin/ki-thi",
    },
  ];

  return (
    <DashboardLayout>
      <div className="mb-4">
        <h3 className="fw-bold text-dark">👋 Chào mừng Quản trị viên!</h3>
        <p className="text-muted">
          Hệ thống Quản lý Điểm thi hiện đang hoạt động ổn định.
        </p>
      </div>

      <div className="row g-4 mb-5">
        {cardData.map((item, idx) => (
          <div className="col-md-3" key={idx}>
            <div
              className={`card border-0 shadow-sm bg-${item.color.split(" ")[0]} h-100 text-white`}
            >
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-uppercase small mb-1">{item.title}</h6>
                    <h2 className="fw-bold mb-0">{item.count}</h2>
                  </div>
                  <div className="fs-1 opacity-50">{item.icon}</div>
                </div>
                <Link
                  to={item.link}
                  className="text-white small text-decoration-none mt-3 d-block border-top pt-2 opacity-75"
                >
                  Xem chi tiết →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card shadow-sm border-0 p-4 bg-light text-center py-5">
        <h4 className="fw-bold">Hành động nhanh</h4>
        <div className="d-flex justify-content-center gap-3 mt-3">
          <Link to="/admin/users" className="btn btn-primary px-4">
            ➕ Cấp tài khoản mới
          </Link>
          <Link to="/admin/diem" className="btn btn-outline-dark px-4">
            📝 Quản lý điểm toàn trường
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
