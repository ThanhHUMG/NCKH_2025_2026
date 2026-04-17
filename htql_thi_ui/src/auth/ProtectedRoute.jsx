import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ children, allowRoles }) {
  const { token, role } = useAuth();

  if (!token) return <Navigate to="/login" />;

  if (allowRoles && !allowRoles.includes(role)) {
    return <Navigate to="/login" />;
  }

  return children;
}
