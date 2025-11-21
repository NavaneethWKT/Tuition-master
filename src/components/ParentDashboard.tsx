import { React } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import {
  BookOpen,
  LogOut,
  User,
  FileText,
  BarChart3,
  TrendingUp,
  FlaskConical,
} from "lucide-react";

interface ParentDashboardProps {
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export function ParentDashboard({
  onNavigate,
  onLogout,
}: ParentDashboardProps) {
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
            {/* Mock Test Generator Card - Same as StudentDashboard */}
            <Card
              className="shadow-lg border-0 hover:shadow-xl transition-shadow cursor-pointer group"
              onClick={() => onNavigate("mock-test")}
            >
              <CardContent className="pt-6 space-y-4">
                <div className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FlaskConical className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="mb-1">Mock Test Generator</h3>
                  <p className="text-sm text-muted-foreground">
                    Practice with AI-generated tests
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Mock Test Review Card */}
            <Card
              className="shadow-lg border-0 hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => onNavigate("mock-test")}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Mock Test Review</CardTitle>
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
              onClick={() => onNavigate("analytics")}
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

        {/* Recent Test Results */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle>Recent Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTestResults.map((test, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium mb-1">{test.testName}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>
                          Score: {test.score}/{test.totalMarks}
                        </span>
                        <span>•</span>
                        <span>{test.date}</span>
                        <span>•</span>
                        <span className="text-green-600 font-medium">
                          {test.status}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">
                        {test.score}%
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Overall Statistics */}
        <div className="grid md:grid-cols-4 gap-6">
          <Card className="shadow-lg border-0">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Average Score</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">
                    {overallStats.averageScore}%
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Tests Completed
                  </p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">
                    {overallStats.testsCompleted}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Improvement</p>
                  <p className="text-3xl font-bold text-green-600 mt-1">
                    {overallStats.improvement}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardContent className="pt-6">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Areas to Improve
                </p>
                <div className="space-y-1">
                  {overallStats.weakAreas.map((area, index) => (
                    <span
                      key={index}
                      className="inline-block bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full mr-1"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
