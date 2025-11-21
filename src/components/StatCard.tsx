import React from "react";
import { Card, CardContent } from "./ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  iconBg?: string;
  iconColor?: string;
  subtitle?: string | React.ReactNode;
  gradient?: boolean;
  gradientFrom?: string;
  gradientTo?: string;
  textColor?: string;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  iconBg = "bg-blue-100",
  iconColor = "text-blue-600",
  subtitle,
  gradient = false,
  gradientFrom = "from-blue-500",
  gradientTo = "to-blue-600",
  textColor = "text-white",
}: StatCardProps) {
  return (
    <Card
      className={`shadow-lg border-0 ${
        gradient
          ? `bg-gradient-to-br ${gradientFrom} ${gradientTo} ${textColor}`
          : ""
      }`}
    >
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p
              className={`text-sm ${
                gradient ? "text-blue-100" : "text-muted-foreground"
              }`}
            >
              {label}
            </p>
            <p
              className={`text-3xl font-bold mt-1 ${
                gradient ? textColor : "text-gray-800"
              }`}
            >
              {value}
            </p>
            {subtitle && (
              <p
                className={`text-xs mt-1 ${
                  gradient ? "text-blue-100" : "text-muted-foreground"
                }`}
              >
                {subtitle}
              </p>
            )}
          </div>
          {Icon && (
            <div
              className={`w-12 h-12 ${
                gradient ? "bg-white/20" : iconBg
              } rounded-xl flex items-center justify-center`}
            >
              <Icon
                className={`w-6 h-6 ${gradient ? "text-white" : iconColor}`}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
