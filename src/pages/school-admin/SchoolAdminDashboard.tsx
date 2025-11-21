import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import {
  School,
  Users,
  UserPlus,
  Upload,
  BookOpen,
  TrendingUp,
  MapPin,
  Phone,
  Mail,
  GraduationCap,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { DashboardHeader } from "../../components/DashboardHeader";
import { StatCard } from "../../components/StatCard";
import { useSchool } from "../../contexts/SchoolContext";

export function SchoolAdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const { schoolData } = useSchool();

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader
        title="Tuition Master"
        subtitle="Admin Portal"
        icon={
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <School className="w-6 h-6 text-white" />
          </div>
        }
      />

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 space-y-6">
        {/* Greeting */}
        <div className="w-3xl">
          <h1 className="text-gray-800 mb-2">
            Welcome back,{" "}
            {schoolData?.adminName
              ? schoolData.adminName.split(" ")[0]
              : "Administrator"}
            !
          </h1>
          <p className="text-muted-foreground">
            Manage your school operations, oversee teachers and classes, track
            student progress, and make data-driven decisions to enhance
            educational outcomes.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <StatCard
            label="Total Students"
            value="1,248"
            icon={Users}
            gradient={true}
            gradientFrom="from-blue-500"
            gradientTo="to-blue-600"
            subtitle={
              <span className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> +12% this month
              </span>
            }
          />
          <StatCard
            label="Active Teachers"
            value={42}
            icon={UserPlus}
            gradient={true}
            gradientFrom="from-green-500"
            gradientTo="to-green-600"
            subtitle="Across all subjects"
          />
          <StatCard
            label="Total Classes"
            value={28}
            icon={BookOpen}
            gradient={true}
            gradientFrom="from-orange-500"
            gradientTo="to-orange-600"
            subtitle="Grades 1-12"
          />
        </div>

        {/* Main Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="teachers">Teachers</TabsTrigger>
            <TabsTrigger value="classes">Classes</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {schoolData ? (
              <div className="grid md:grid-cols-2 gap-6">
                {/* School Basic Information */}
                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <School className="w-5 h-5" />
                      School Basic Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm font-semibold text-foreground flex items-center gap-2 mb-1">
                        <GraduationCap className="w-4 h-4" />
                        School Name
                      </p>
                      <p className="text-base">
                        {schoolData.schoolName || "N/A"}
                      </p>
                    </div>

                    <div className="pt-4 border-t space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-semibold text-foreground">
                          Board Affiliation:
                        </span>
                        <span className="uppercase">
                          {schoolData.boardAffiliation || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="font-semibold text-foreground">
                          Establishment Year:
                        </span>
                        <span>{schoolData.establishmentYear || "N/A"}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Contact & Address Information */}
                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Contact & Address Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm font-semibold text-foreground mb-2">
                        Contact Details
                      </p>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-semibold text-foreground flex items-center gap-2 mb-1">
                            <Mail className="w-4 h-4" />
                            Email Address
                          </p>
                          <p className="text-sm break-all">
                            {schoolData.email || "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground flex items-center gap-2 mb-1">
                            <Phone className="w-4 h-4" />
                            Phone Number
                          </p>
                          <p className="text-sm">{schoolData.phone || "N/A"}</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <p className="text-sm font-semibold text-foreground mb-2">
                        Address
                      </p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-semibold text-foreground">
                            City:
                          </span>
                          <span>{schoolData.city || "N/A"}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="font-semibold text-foreground">
                            State:
                          </span>
                          <span>{schoolData.state || "N/A"}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="font-semibold text-foreground">
                            Pincode:
                          </span>
                          <span>{schoolData.pincode || "N/A"}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Administrative Details */}
                <Card className="shadow-lg border-0 md:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Administrative Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Principal Details */}
                      <div>
                        <p className="text-sm font-semibold text-foreground mb-3">
                          Principal
                        </p>
                        <div className="space-y-3">
                          <div>
                            <p className="text-xs font-semibold text-muted-foreground mb-1">
                              Name:
                            </p>
                            <p className="text-sm">
                              {schoolData.principalName || "N/A"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-muted-foreground mb-1">
                              Email:
                            </p>
                            <p className="text-sm break-all">
                              {schoolData.principalEmail || "N/A"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-muted-foreground mb-1">
                              Phone:
                            </p>
                            <p className="text-sm">
                              {schoolData.principalPhone || "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Admin Details */}
                      <div>
                        <p className="text-sm font-semibold text-foreground mb-3">
                          Administrator
                        </p>
                        <div className="space-y-3">
                          <div>
                            <p className="text-xs font-semibold text-muted-foreground mb-1">
                              Name:
                            </p>
                            <p className="text-sm">
                              {schoolData.adminName || "N/A"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-muted-foreground mb-1">
                              Email:
                            </p>
                            <p className="text-sm break-all">
                              {schoolData.adminEmail || "N/A"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-muted-foreground mb-1">
                              Phone:
                            </p>
                            <p className="text-sm">
                              {schoolData.adminPhone || "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="shadow-lg border-0">
                <CardContent className="text-center py-12">
                  <p className="text-muted-foreground mb-4">
                    No school information available
                  </p>
                  <Button
                    onClick={() => navigate("/school-onboarding")}
                    className="w-full md:w-auto"
                  >
                    Complete School Onboarding
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Teachers Tab */}
          <TabsContent value="teachers" className="space-y-6">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Teachers Management</CardTitle>
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
