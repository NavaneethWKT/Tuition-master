import { React, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  School,
  Users,
  UserPlus,
  Upload,
  BarChart3,
  LogOut,
  BookOpen,
  TrendingUp,
  FileText,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

interface SchoolAdminDashboardProps {
  onLogout: () => void;
}

export function SchoolAdminDashboard({ onLogout }: SchoolAdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <School className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-semibold text-foreground">
                Tuition Master
              </span>
              <p className="text-xs text-muted-foreground">Admin Portal</p>
            </div>
          </div>
          <Button variant="ghost" onClick={onLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 space-y-6">
        {/* Greeting */}
        <div>
          <h1 className="text-gray-800 mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your school, teachers, classes, and monitor performance
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6">
          <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-100">Total Students</p>
                  <p className="text-3xl font-bold mt-1">1,248</p>
                  <p className="text-xs text-blue-100 mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> +12% this month
                  </p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-100">Active Teachers</p>
                  <p className="text-3xl font-bold mt-1">42</p>
                  <p className="text-xs text-green-100 mt-1">
                    Across all subjects
                  </p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <UserPlus className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-100">Total Classes</p>
                  <p className="text-3xl font-bold mt-1">28</p>
                  <p className="text-xs text-orange-100 mt-1">Grades 1-12</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
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
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="teachers">Teachers</TabsTrigger>
            <TabsTrigger value="classes">Classes</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* School Profile */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <School className="w-5 h-5" />
                    School Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">School Name</p>
                    <p className="font-medium">
                      Greenwood International School
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="font-medium">
                      123 Education Street, Chennai, Tamil Nadu
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Contact</p>
                    <p className="font-medium">+91 98765 43210</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">admin@greenwood.edu</p>
                  </div>
                  <Button variant="outline" className="w-full">
                    Edit Profile
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Teachers Tab */}
          <TabsContent value="teachers" className="space-y-6">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Teachers Management</CardTitle>
                  <Button className="gap-2">
                    <UserPlus className="w-4 h-4" />
                    Add Teacher
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Add Teacher Form */}
                <div className="p-6 border-2 border-border rounded-xl space-y-4">
                  <h4 className="font-medium">Add New Teacher</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <Input placeholder="Enter teacher name" />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input type="email" placeholder="teacher@school.edu" />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone Number</Label>
                      <Input type="tel" placeholder="+91 98765 43210" />
                    </div>
                    <div className="space-y-2">
                      <Label>Subject</Label>
                      <Input placeholder="Mathematics" />
                    </div>
                    <div className="space-y-2">
                      <Label>Qualification</Label>
                      <Input placeholder="M.Sc., B.Ed" />
                    </div>
                    <div className="space-y-2">
                      <Label>Experience (years)</Label>
                      <Input type="number" placeholder="5" />
                    </div>
                  </div>
                  <Button className="w-full">Add Teacher</Button>
                </div>

                {/* Teachers List */}
                <div>
                  <h4 className="font-medium mb-4">All Teachers</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Classes</TableHead>
                        <TableHead>Students</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[
                        {
                          name: "Dr. Rajesh Sharma",
                          subject: "Mathematics",
                          classes: 8,
                          students: 156,
                          status: "Active",
                        },
                        {
                          name: "Prof. Priya Kumar",
                          subject: "Physics",
                          classes: 6,
                          students: 124,
                          status: "Active",
                        },
                        {
                          name: "Ms. Anita Singh",
                          subject: "Chemistry",
                          classes: 7,
                          students: 142,
                          status: "Active",
                        },
                        {
                          name: "Mr. Vikram Patel",
                          subject: "Biology",
                          classes: 5,
                          students: 98,
                          status: "Active",
                        },
                      ].map((teacher, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            {teacher.name}
                          </TableCell>
                          <TableCell>{teacher.subject}</TableCell>
                          <TableCell>{teacher.classes}</TableCell>
                          <TableCell>{teacher.students}</TableCell>
                          <TableCell>
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                              {teacher.status}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm">
                                Edit
                              </Button>
                              <Button variant="ghost" size="sm">
                                View
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Classes Tab */}
          <TabsContent value="classes" className="space-y-6">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Classes & Sections</CardTitle>
                  <Button className="gap-2">
                    <BookOpen className="w-4 h-4" />
                    Add Class
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Add Class Form */}
                <div className="p-6 border-2 border-border rounded-xl space-y-4">
                  <h4 className="font-medium">Create New Class</h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Grade</Label>
                      <Input placeholder="e.g., 10" />
                    </div>
                    <div className="space-y-2">
                      <Label>Section</Label>
                      <Input placeholder="e.g., A" />
                    </div>
                    <div className="space-y-2">
                      <Label>Class Teacher</Label>
                      <Input placeholder="Select teacher" />
                    </div>
                  </div>
                  <Button className="w-full">Create Class</Button>
                </div>

                {/* Classes Grid */}
                <div>
                  <h4 className="font-medium mb-4">All Classes</h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    {[
                      {
                        grade: "10",
                        section: "A",
                        students: 35,
                        teacher: "Dr. Rajesh Sharma",
                      },
                      {
                        grade: "10",
                        section: "B",
                        students: 32,
                        teacher: "Prof. Priya Kumar",
                      },
                      {
                        grade: "9",
                        section: "A",
                        students: 38,
                        teacher: "Ms. Anita Singh",
                      },
                      {
                        grade: "9",
                        section: "B",
                        students: 36,
                        teacher: "Mr. Vikram Patel",
                      },
                      {
                        grade: "8",
                        section: "A",
                        students: 40,
                        teacher: "Dr. Rajesh Sharma",
                      },
                      {
                        grade: "8",
                        section: "B",
                        students: 38,
                        teacher: "Prof. Priya Kumar",
                      },
                    ].map((classItem, index) => (
                      <Card
                        key={index}
                        className="border-2 hover:shadow-md transition-shadow"
                      >
                        <CardContent className="pt-6 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                              <span className="text-xl font-bold text-primary">
                                {classItem.grade}
                                {classItem.section}
                              </span>
                            </div>
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                              Active
                            </span>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Students
                            </p>
                            <p className="font-semibold">
                              {classItem.students}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Class Teacher
                            </p>
                            <p className="text-sm font-medium">
                              {classItem.teacher}
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                          >
                            Manage
                          </Button>
                        </CardContent>
                      </Card>
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
