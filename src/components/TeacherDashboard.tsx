import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  BookOpen,
  Upload,
  FileText,
  Users,
  LogOut,
  PlusCircle,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export function TeacherDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-semibold text-foreground">
                Tuition Master
              </span>
              <p className="text-xs text-muted-foreground">Teacher Portal</p>
            </div>
          </div>
          <Button variant="ghost" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 space-y-6">
        {/* Greeting */}
        <div>
          <h1 className="text-gray-800 mb-2">Welcome, Prof. Sharma 👨‍🏫</h1>
          <p className="text-muted-foreground">
            Manage your classes, materials, and track student progress
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6">
          <Card className="shadow-lg border-0">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Students
                  </p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">156</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Classes</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">8</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tests Created</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">24</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="materials">Materials</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Recent Classes */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle>Recent Classes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        name: "Grade 10 - Section A",
                        subject: "Mathematics",
                        students: 35,
                      },
                      {
                        name: "Grade 10 - Section B",
                        subject: "Mathematics",
                        students: 32,
                      },
                      {
                        name: "Grade 9 - Section A",
                        subject: "Mathematics",
                        students: 38,
                      },
                    ].map((classItem, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{classItem.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {classItem.subject} • {classItem.students}{" "}
                              students
                            </p>
                          </div>
                          <Button size="sm">View</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Materials Tab */}
          <TabsContent value="materials" className="space-y-6">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Study Materials</CardTitle>
                  <Button className="gap-2">
                    <PlusCircle className="w-4 h-4" />
                    Upload Material
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-border rounded-xl p-8">
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                        <Upload className="w-8 h-8 text-primary" />
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-gray-800 mb-1">
                          Upload Study Materials
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Upload notes, PDFs, or other study materials for your
                          students
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <Button variant="outline">Browse Files</Button>
                        <Button>Upload from URL</Button>
                      </div>
                    </div>
                  </div>

                  {/* Uploaded Materials List */}
                  <div className="space-y-3 mt-6">
                    <h4 className="font-medium">Recently Uploaded</h4>
                    {[
                      {
                        name: "Chapter 5 - Algebra Notes.pdf",
                        date: "Nov 20, 2025",
                        size: "2.4 MB",
                      },
                      {
                        name: "Practice Problems Set 3.pdf",
                        date: "Nov 18, 2025",
                        size: "1.8 MB",
                      },
                      {
                        name: "Trigonometry Formulas.pdf",
                        date: "Nov 15, 2025",
                        size: "856 KB",
                      },
                    ].map((material, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-red-600" />
                          </div>
                          <div>
                            <p className="font-medium">{material.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {material.date} • {material.size}
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
