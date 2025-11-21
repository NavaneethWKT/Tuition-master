import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
  User,
  FileText,
  BarChart3,
  TrendingUp,
  FlaskConical,
} from "lucide-react";
import { DashboardHeader } from "../../components/DashboardHeader";
import { ActionCard } from "../../components/ActionCard";
import { StatCard } from "../../components/StatCard";

export function ParentDashboard() {
  const navigate = useNavigate();
  // Mock student data
  const studentInfo = {
    name: "Arjun Sharma",
    grade: "10",
    section: "A",
    rollNumber: "25",
    school: "Delhi Public School",
  };

  const recentTestResults = [
    {
      testName: "Mathematics - Algebra Test",
      score: 85,
      totalMarks: 100,
      date: "Nov 20, 2025",
      status: "Completed",
    },
    {
      testName: "Physics - Motion Test",
      score: 78,
      totalMarks: 100,
      date: "Nov 18, 2025",
      status: "Completed",
    },
    {
      testName: "Chemistry - Periodic Table Quiz",
      score: 92,
      totalMarks: 100,
      date: "Nov 15, 2025",
      status: "Completed",
    },
  ];

  const overallStats = {
    averageScore: 85,
    testsCompleted: 12,
    improvement: "+5%",
    weakAreas: ["Algebra", "Trigonometry"],
  };

  return (
    <div className="min-h-screen bg-paper">
      <DashboardHeader />

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* Greeting */}
        <div>
          <h1 className="text-gray-800 mb-2">Welcome, Parent 👋</h1>
          <p className="text-muted-foreground">
            Monitor your child's progress and performance
          </p>
        </div>

        {/* Student Info Card */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">
                    {studentInfo.name}
                  </h2>
                  <div className="flex gap-4 text-blue-100">
                    <span>
                      Grade {studentInfo.grade} - Section {studentInfo.section}
                    </span>
                    <span>•</span>
                    <span>Roll No: {studentInfo.rollNumber}</span>
                  </div>
                  <p className="text-blue-100 mt-1">{studentInfo.school}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div>
          <h2 className="mb-6 text-gray-800">Quick Actions</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Mock Test Review Card */}
            <Card
              className="shadow-lg border-0 hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => navigate("/parent/mock-test")}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Generate Mock Test</CardTitle>
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Review your child's mock test answers and provide feedback
                </p>
                <Button className="w-full">View Mock Tests</Button>
              </CardContent>
            </Card>

            {/* Student Analytics Card */}
            <Card
              className="shadow-lg border-0 hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => navigate("/parent/analytics")}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Student Analytics</CardTitle>
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  View detailed analytics and performance metrics
                </p>
                <Button className="w-full">View Analytics</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
