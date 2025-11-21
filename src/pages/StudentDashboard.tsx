import React from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Bot,
  RotateCcw,
  FlaskConical,
} from "lucide-react";
import { DashboardHeader } from "../components/DashboardHeader";
import { ActionCard } from "../components/ActionCard";

export function StudentDashboard() {
  const navigate = useNavigate();

  const actionCards = [
    {
      title: "AI Tuition Master",
      description: "Get personalized AI tutoring",
      icon: Bot,
      color: "bg-purple-500",
      route: "/student/ai-chat",
    },
    {
      title: "Class Notes",
      description: "View materials from teachers",
      icon: BookOpen,
      color: "bg-indigo-500",
      route: "/student/class-notes",
    },
    {
      title: "Revision",
      description: "Review your saved topics",
      icon: RotateCcw,
      color: "bg-green-500",
      route: "/student/revision",
    },
    {
      title: "Mock Test Generator",
      description: "Practice with AI-generated tests",
      icon: FlaskConical,
      color: "bg-orange-500",
      route: "/student/mock-test",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto px-6 py-8 space-y-8">
        <div>
          <h1 className="text-gray-800 mb-2">Hello, Arjun 👋</h1>
          <p className="text-muted-foreground">
            Welcome back! Ready to learn today?
          </p>
        </div>
        <div>
          <h2 className="mb-6 text-gray-800">Quick Actions</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {actionCards.map((card) => (
              <ActionCard
                key={card.route}
                title={card.title}
                description={card.description}
                icon={card.icon}
                color={card.color}
                onClick={() => navigate(card.route)}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
