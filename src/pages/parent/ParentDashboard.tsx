import React, { useState, useEffect } from "react";
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
  Loader2,
} from "lucide-react";
import { DashboardHeader } from "../../components/DashboardHeader";
import { ActionCard } from "../../components/ActionCard";
import { StatCard } from "../../components/StatCard";
import { useAuth } from "../../contexts/AuthContext";
import apiClient from "../../services/apiClient";

export function ParentDashboard() {
  const navigate = useNavigate();
  const { userData } = useAuth();

  const [studentData, setStudentData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userData?.id) {
      fetchStudentDetails();
    }
  }, [userData?.id]);

  const fetchStudentDetails = async () => {
    if (!userData?.id) return;
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.getParentStudent(userData.id);
      setStudentData(response);
    } catch (err: any) {
      console.error("Error fetching student details:", err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to fetch student details. Please try again."
      );
    } finally {
      setLoading(false);
    }
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
            {error && (
              <div className="mb-4 p-3 bg-white/20 rounded-md border border-white/30">
                <p className="text-sm text-white">{error}</p>
              </div>
            )}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-white" />
                <span className="ml-2 text-white">
                  Loading student details...
                </span>
              </div>
            ) : studentData ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">
                      {studentData.full_name || "N/A"}
                    </h2>
                    <div className="flex gap-4 text-blue-100">
                      <span>Roll No: {studentData.roll_number || "N/A"}</span>
                      {studentData.email && (
                        <>
                          <span>•</span>
                          <span>{studentData.email}</span>
                        </>
                      )}
                    </div>
                    {studentData.phone && (
                      <p className="text-blue-100 mt-1">{studentData.phone}</p>
                    )}
                    {studentData.date_of_birth && (
                      <p className="text-blue-100 mt-1 text-sm">
                        Date of Birth:{" "}
                        {new Date(
                          studentData.date_of_birth
                        ).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-white">
                No student information available
              </div>
            )}
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
                <Button className="w-full">Generate</Button>
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
