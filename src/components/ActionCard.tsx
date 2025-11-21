import React from "react";
import { Card, CardContent } from "./ui/card";
import { LucideIcon } from "lucide-react";

interface ActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  onClick: () => void;
}

export function ActionCard({
  title,
  description,
  icon: Icon,
  color,
  onClick,
}: ActionCardProps) {
  return (
    <Card
      className="shadow-lg border-0 hover:shadow-xl transition-shadow cursor-pointer group"
      onClick={onClick}
    >
      <CardContent className="pt-6 space-y-4">
        <div
          className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}
        >
          <Icon className="w-7 h-7 text-white" />
        </div>
        <div>
          <h3 className="mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}

