import React from "react";
import { Button } from "./ui/button";
import { BookOpen, School, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface DashboardHeaderProps {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

export function DashboardHeader({
  title = "Tuition Master",
  subtitle,
  icon,
}: DashboardHeaderProps) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-white border-b border-border sticky top-0 z-10">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {icon || (
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
          )}
          <div>
            <span className="font-semibold text-foreground">{title}</span>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
        </div>
        <Button variant="ghost" onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </header>
  );
}
