import React from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="bg-light" style={{ minHeight: "100vh" }}>
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <div
          className="flex-grow-1 p-4 overflow-hidden"
          style={{ maxWidth: "calc(100vw - 280px)" }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
