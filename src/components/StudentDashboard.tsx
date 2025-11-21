import { React } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import {
  BookOpen,
  Bot,
  RotateCcw,
  FlaskConical,
  Upload,
  BarChart3,
  LogOut,
  Coins,
} from "lucide-react";

interface StudentDashboardProps {
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export function StudentDashboard({
  onNavigate,
  onLogout,
}: StudentDashboardProps) {
  const actionCards = [
    {
      title: "AI Tuition Master",
      description: "Get personalized AI tutoring",
      icon: Bot,
      color: "bg-purple-500",
      page: "ai-chat",
    },
    {
      title: "Class Notes",
      description: "View materials from teachers",
      icon: BookOpen,
      color: "bg-indigo-500",
      page: "class-notes",
    },
    {
      title: "Revision",
      description: "Review your saved topics",
      icon: RotateCcw,
      color: "bg-green-500",
      page: "revision",
    },
    {
      title: "Mock Test Generator",
      description: "Practice with AI-generated tests",
      icon: FlaskConical,
      color: "bg-orange-500",
      page: "mock-test",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="font-semibold text-foreground">
              Tuition Master
            </span>
          </div>
          <Button variant="ghost" onClick={onLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* Greeting */}
        <div>
          <h1 className="text-gray-800 mb-2">Hello, Arjun 👋</h1>
          <p className="text-muted-foreground">
            Welcome back! Ready to learn today?
          </p>
        </div>

        {/* Action Cards Grid */}
        <div>
          <h2 className="mb-6 text-gray-800">Quick Actions</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {actionCards.map((card) => {
              const Icon = card.icon;
              return (
                <Card
                  key={card.page}
                  className="shadow-lg border-0 hover:shadow-xl transition-shadow cursor-pointer group"
                  onClick={() => onNavigate(card.page)}
                >
                  <CardContent className="pt-6 space-y-4">
                    <div
                      className={`w-14 h-14 ${card.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="mb-1">{card.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {card.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
