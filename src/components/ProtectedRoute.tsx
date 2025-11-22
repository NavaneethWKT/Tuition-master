import React, { ReactNode, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface ProtectedRouteProps {
  children?: ReactNode;
  allowedRoles: ("student" | "parent" | "teacher" | "school")[];
}

export function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const { userRole, isAuthenticated } = useAuth();

  // Check if user is authenticated (has role - token may be null)
  if (!isAuthenticated || !userRole) {
    return <Navigate to="/login" replace />;
  }

  // Check if user's role is allowed
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/login" replace />;
  }

  return <>{children || null}</>;
}
