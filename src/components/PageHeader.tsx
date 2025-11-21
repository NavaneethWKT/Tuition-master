import React from "react";
import { Button } from "./ui/button";
import { ArrowLeft, BookOpen, School } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  backRoute?: string;
  icon?: React.ReactNode;
  rightAction?: React.ReactNode;
}

export function PageHeader({
  title,
  subtitle,
  showBackButton = false,
  backRoute,
  icon,
  rightAction,
}: PageHeaderProps) {
  const navigate = useNavigate();
  const { userRole } = useAuth();

  const handleBack = () => {
    if (backRoute) {
      navigate(backRoute);
    } else {
      // Default back routes based on user role
      const defaultRoute =
        userRole === "student"
          ? "/student/dashboard"
          : userRole === "parent"
          ? "/parent/dashboard"
          : userRole === "teacher"
          ? "/teacher/dashboard"
          : userRole === "admin"
          ? "/admin/dashboard"
          : "/login";
      navigate(defaultRoute);
    }
  };

  return (
    <header className="bg-white border-b border-border sticky top-0 z-10">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {showBackButton && (
            <Button variant="ghost" size="icon" onClick={handleBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          {icon && <div className="flex items-center gap-3">{icon}</div>}
          <div>
            <h2 className="text-gray-800">{title}</h2>
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
        </div>
        {rightAction && <div>{rightAction}</div>}
      </div>
    </header>
  );
}

