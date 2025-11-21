import React from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Bot, RotateCcw, FlaskConical } from "lucide-react";
import { DashboardHeader } from "../../components/DashboardHeader";
import { ActionCard } from "../../components/ActionCard";

export function StudentDashboard() {
  const navigate = useNavigate();

  const actionCards = [
    {
      title: "AI Tuition Master: Smart Notes",
      description:
        "Learn faster with teacher notes enhanced by AI explanations",
      icon: BookOpen,
      color: "bg-indigo-600",
      route: "/student/class-notes",
    },
    {
      title: "Revision",
      description: "Review and strengthen your weak areas",
      icon: RotateCcw,
      color: "bg-emerald-600",
      route: "/student/revision",
    },
    {
      title: "Mock Test Generator",
      description: "Practice with personalized AI-generated tests",
      icon: FlaskConical,
      color: "bg-orange-600",
      route: "/student/mock-test",
    },
  ];

  return (
    <div className="min-h-screen bg-paper text-gray-900 flex flex-col">
      <DashboardHeader />

      <div className="flex flex-col flex-1 max-w-7xl w-full mx-auto px-6 pt-10 pb-4 space-y-20">
        {/* Hero div */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-sm border border-slate-200 flex flex-col">
          <h1 className="text-2xl text-white font-bold">Hello Arjun 👋</h1>
          <p className="text-gray-100 mt-1">
            Ready to make progress today? Pick something below to get started.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

        {/* Motivation Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-center border border-slate-200 shadow-sm flex flex-col items-center justify-center">
          <h3 className="text-lg font-medium text-white">
            Stay consistent, Arjun! 🚀
          </h3>
          <p className="text-gray-100 mt-1">
            Even 1% growth every day leads to massive success.
          </p>
        </div>
      </div>
    </div>
  );
}
