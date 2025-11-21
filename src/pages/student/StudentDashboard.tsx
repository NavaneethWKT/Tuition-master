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
    <div className="min-h-screen bg-paper text-gray-900">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-6 py-10 space-y-10 p-10">
        {/* Hero Section */}
        <section className="p-6 rounded-3xl bg-slate-100 shadow-sm border border-slate-200">
          <h1 className="text-2xl font-bold">Hello Arjun 👋</h1>
          <p className="text-gray-600 mt-1">
            Ready to make progress today? Pick something below to get started.
          </p>
        </section>

        {/* Quick Actions */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>

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
        </section>

        {/* Motivation Banner */}
        <section className="p-6 rounded-2xl bg-slate-100 text-center border border-slate-200 shadow-sm">
          <h3 className="text-lg font-medium">Stay consistent, Arjun! 🚀</h3>
          <p className="text-gray-600 mt-1">
            Even 1% growth every day leads to massive success.
          </p>
        </section>
      </main>
    </div>
  );
}
