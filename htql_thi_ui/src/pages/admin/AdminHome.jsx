import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layout/DashboardLayout"; // [cite: 735]
import axiosClient from "../../api/axiosClient"; // [cite: 692]
import {
  Users,
  GraduationCap,
  School,
  ClipboardCheck,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminHome() {
  const [stats, setStats] = useState({ sv: 0, gv: 0, lh: 0, kt: 0 });

  useEffect(() => {
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
        console.error("Lỗi thống kê");
      }
    };
    loadStats();
  }, []);

  const cards = [
    {
      title: "Sinh Viên",
      count: stats.sv,
      icon: <GraduationCap size={28} />,
      color: "#4e73df",
      link: "/admin/sinh-vien",
    },
    {
      title: "Giáo Viên",
      count: stats.gv,
      icon: <Users size={28} />,
      color: "#1cc88a",
      link: "/admin/giao-vien",
    },
    {
      title: "Lớp Học",
      count: stats.lh,
      icon: <School size={28} />,
      color: "#f6c23e",
      link: "/admin/lop-hoc",
    },
    {
      title: "Kỳ Thi",
      count: stats.kt,
      icon: <ClipboardCheck size={28} />,
      color: "#e74a3b",
      link: "/admin/ki-thi",
    },
  ];

  return (
    <DashboardLayout>
      <div className="mb-4">
        <h3 className="fw-bold text-dark">Bảng Điều Khiển Admin</h3>
        <p className="text-muted">
          Chào mừng quay trở lại hệ thống quản lý đào tạo.
        </p>
      </div>

      <div className="row g-4 mb-5">
        {cards.map((c, i) => (
          <div className="col-md-6 col-xl-3" key={i}>
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div
                    className="p-3 rounded-3"
                    style={{ background: `${c.color}15`, color: c.color }}
                  >
                    {c.icon}
                  </div>
                  <h3 className="fw-bold mb-0">{c.count}</h3>
                </div>
                <h6 className="text-muted small text-uppercase fw-bold mb-3">
                  {c.title}
                </h6>
                <Link
                  to={c.link}
                  className="text-decoration-none small fw-bold d-flex align-items-center gap-1"
                  style={{ color: c.color }}
                >
                  Chi tiết <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
