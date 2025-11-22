import React, { useState, useEffect } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
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
  Loader2,
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
import { useAuth } from "../../contexts/AuthContext";
import apiClient from "../../services/apiClient";

export function SchoolAdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const { schoolData } = useSchool();
  const { userData } = useAuth();

  // State for API data
  const [schoolDetails, setSchoolDetails] = useState<any>(null);
  const [classes, setClasses] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState({
    overview: false,
    classes: false,
    teachers: false,
  });

  // State for create class form
  const [newClassForm, setNewClassForm] = useState({
    grade: "",
    section: "",
    classTeacherId: "",
  });

  // State for create teacher form
  const [newTeacherForm, setNewTeacherForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    subjects: "",
    qualification: "",
    experience_years: "",
    joining_date: "",
  });

  // Loading states for form submissions
  const [submitting, setSubmitting] = useState({
    teacher: false,
    class: false,
  });

  // Get school ID - prefer schoolDetails.id, fallback to userData.id
  const schoolId = schoolDetails?.id || userData?.id;

  // Fetch school details when component mounts (overview tab)
  useEffect(() => {
    if (schoolId && activeTab === "overview") {
      fetchSchoolDetails();
    }
  }, [schoolId, activeTab]);

  // Fetch classes when classes tab is active
  useEffect(() => {
    if (schoolId && activeTab === "classes") {
      fetchClasses();
      // Also fetch teachers so they're available for the dropdown
      fetchTeachers();
    }
  }, [schoolId, activeTab]);

  // Fetch teachers when teachers tab is active
  useEffect(() => {
    if (schoolId && activeTab === "teachers") {
      fetchTeachers();
    }
  }, [schoolId, activeTab]);

  const fetchSchoolDetails = async () => {
    if (!schoolId) return;
    setLoading((prev) => ({ ...prev, overview: true }));
    try {
      const response = await apiClient.getSchoolDetails(schoolId);
      setSchoolDetails(response);
    } catch (error) {
      console.error("Error fetching school details:", error);
    } finally {
      setLoading((prev) => ({ ...prev, overview: false }));
    }
  };

  const fetchClasses = async () => {
    if (!schoolId) return;
    setLoading((prev) => ({ ...prev, classes: true }));
    try {
      const response = await apiClient.getSchoolClasses(schoolId);
      setClasses(Array.isArray(response) ? response : response.classes || []);
    } catch (error) {
      console.error("Error fetching classes:", error);
    } finally {
      setLoading((prev) => ({ ...prev, classes: false }));
    }
  };

  const fetchTeachers = async () => {
    if (!schoolId) return;
    setLoading((prev) => ({ ...prev, teachers: true }));
    try {
      const response = await apiClient.getSchoolTeachers(schoolId);
      setTeachers(Array.isArray(response) ? response : response.teachers || []);
    } catch (error) {
      console.error("Error fetching teachers:", error);
    } finally {
      setLoading((prev) => ({ ...prev, teachers: false }));
    }
  };

  // Handle create teacher
  const handleCreateTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentSchoolId = schoolDetails?.id || userData?.id;

    if (!currentSchoolId) {
      console.error(
        "School ID not found. userData:",
        userData,
        "schoolDetails:",
        schoolDetails
      );
      alert(
        "School ID not found. Please ensure you're logged in and try refreshing the page."
      );
      return;
    }

    setSubmitting((prev) => ({ ...prev, teacher: true }));
    try {
      // Convert subjects string to array (comma-separated)
      const subjectsArray = newTeacherForm.subjects
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const requestBody = {
        school_id: currentSchoolId,
        full_name: newTeacherForm.full_name,
        email: newTeacherForm.email,
        phone: newTeacherForm.phone,
        password: newTeacherForm.password,
        subjects: subjectsArray,
        qualification: newTeacherForm.qualification,
        experience_years: parseInt(newTeacherForm.experience_years) || 0,
        joining_date:
          newTeacherForm.joining_date || new Date().toISOString().split("T")[0],
      };

      await apiClient.createTeacher(requestBody);

      // Reset form
      setNewTeacherForm({
        full_name: "",
        email: "",
        phone: "",
        password: "",
        subjects: "",
        qualification: "",
        experience_years: "",
        joining_date: "",
      });

      // Refresh teachers list and school details
      await Promise.all([fetchTeachers(), fetchSchoolDetails()]);

      alert("Teacher created successfully!");
    } catch (error: any) {
      console.error("Error creating teacher:", error);
      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to create teacher. Please try again."
      );
    } finally {
      setSubmitting((prev) => ({ ...prev, teacher: false }));
    }
  };

  // Handle create class
  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentSchoolId = schoolDetails?.id || userData?.id;

    if (!currentSchoolId) {
      console.error(
        "School ID not found. userData:",
        userData,
        "schoolDetails:",
        schoolDetails
      );
      alert(
        "School ID not found. Please ensure you're logged in and try refreshing the page."
      );
      return;
    }

    setSubmitting((prev) => ({ ...prev, class: true }));
    try {
      const requestBody = {
        school_id: currentSchoolId,
        grade: parseInt(newClassForm.grade) || 0,
        section: newClassForm.section,
        class_teacher_id: newClassForm.classTeacherId || "",
      };

      await apiClient.createClass(requestBody);

      // Reset form
      setNewClassForm({
        grade: "",
        section: "",
        classTeacherId: "",
      });

      // Refresh classes list and school details
      await Promise.all([fetchClasses(), fetchSchoolDetails()]);

      alert("Class created successfully!");
    } catch (error: any) {
      console.error("Error creating class:", error);
      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to create class. Please try again."
      );
    } finally {
      setSubmitting((prev) => ({ ...prev, class: false }));
    }
  };

  return (
    <div className="min-h-screen bg-paper">
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
            {schoolDetails?.admin_name || schoolData?.adminName
              ? (schoolDetails?.admin_name || schoolData.adminName).split(
                  " "
                )[0]
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
            value={
              loading.overview
                ? "..."
                : schoolDetails?.total_students?.toLocaleString() || "0"
            }
            icon={Users}
            gradient={true}
            gradientFrom="from-blue-500"
            gradientTo="to-blue-600"
          />
          <StatCard
            label="Active Teachers"
            value={
              loading.overview
                ? "..."
                : schoolDetails?.total_teachers?.toLocaleString() || "0"
            }
            icon={UserPlus}
            gradient={true}
            gradientFrom="from-green-500"
            gradientTo="to-green-600"
            subtitle="Across all subjects"
          />
          <StatCard
            label="Total Classes"
            value={
              loading.overview
                ? "..."
                : schoolDetails?.total_classes?.toLocaleString() || "0"
            }
            icon={BookOpen}
            gradient={true}
            gradientFrom="from-orange-500"
            gradientTo="to-orange-600"
            subtitle="All grades"
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
            {loading.overview ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">
                  Loading school details...
                </span>
              </div>
            ) : (
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
                        {schoolDetails?.name || schoolData?.schoolName || "N/A"}
                      </p>
                    </div>

                    <div className="pt-4 border-t space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-semibold text-foreground">
                          Board Affiliation:
                        </span>
                        <span className="uppercase">
                          {schoolDetails?.board_affiliation ||
                            schoolData?.boardAffiliation ||
                            "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="font-semibold text-foreground">
                          Establishment Year:
                        </span>
                        <span>
                          {schoolDetails?.establishment_year ||
                            schoolData?.establishmentYear ||
                            "N/A"}
                        </span>
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
                            {schoolDetails?.contact_email ||
                              schoolData?.email ||
                              "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground flex items-center gap-2 mb-1">
                            <Phone className="w-4 h-4" />
                            Phone Number
                          </p>
                          <p className="text-sm">
                            {schoolDetails?.contact_phone ||
                              schoolData?.phone ||
                              "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <p className="text-sm font-semibold text-foreground mb-2">
                        Address
                      </p>
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground mb-1">
                            Full Address:
                          </p>
                          <p className="text-sm">
                            {schoolDetails?.address || "N/A"}
                          </p>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="font-semibold text-foreground">
                            City:
                          </span>
                          <span>
                            {schoolDetails?.city || schoolData?.city || "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="font-semibold text-foreground">
                            State:
                          </span>
                          <span>
                            {schoolDetails?.state || schoolData?.state || "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="font-semibold text-foreground">
                            Pincode:
                          </span>
                          <span>
                            {schoolDetails?.pincode ||
                              schoolData?.pincode ||
                              "N/A"}
                          </span>
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
                              {schoolDetails?.principal_name ||
                                schoolData?.principalName ||
                                "N/A"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-muted-foreground mb-1">
                              Email:
                            </p>
                            <p className="text-sm break-all">
                              {schoolDetails?.principal_email ||
                                schoolData?.principalEmail ||
                                "N/A"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-muted-foreground mb-1">
                              Phone:
                            </p>
                            <p className="text-sm">
                              {schoolDetails?.principal_phone ||
                                schoolData?.principalPhone ||
                                "N/A"}
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
                              {schoolDetails?.admin_name ||
                                schoolData?.adminName ||
                                "N/A"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-muted-foreground mb-1">
                              Email:
                            </p>
                            <p className="text-sm break-all">
                              {schoolDetails?.admin_email ||
                                schoolData?.adminEmail ||
                                "N/A"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-muted-foreground mb-1">
                              Phone:
                            </p>
                            <p className="text-sm">
                              {schoolDetails?.admin_phone ||
                                schoolData?.adminPhone ||
                                "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
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
                <form onSubmit={handleCreateTeacher}>
                  <div className="p-6 border-2 border-border rounded-xl space-y-4">
                    <h4 className="font-medium">Add New Teacher</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Full Name *</Label>
                        <Input
                          placeholder="Enter teacher name"
                          value={newTeacherForm.full_name}
                          onChange={(e) =>
                            setNewTeacherForm({
                              ...newTeacherForm,
                              full_name: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Email *</Label>
                        <Input
                          type="email"
                          placeholder="teacher@school.edu"
                          value={newTeacherForm.email}
                          onChange={(e) =>
                            setNewTeacherForm({
                              ...newTeacherForm,
                              email: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Phone Number *</Label>
                        <Input
                          type="tel"
                          placeholder="+91 98765 43210"
                          value={newTeacherForm.phone}
                          onChange={(e) =>
                            setNewTeacherForm({
                              ...newTeacherForm,
                              phone: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Password *</Label>
                        <Input
                          type="password"
                          placeholder="Enter password"
                          value={newTeacherForm.password}
                          onChange={(e) =>
                            setNewTeacherForm({
                              ...newTeacherForm,
                              password: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Subjects (comma-separated) *</Label>
                        <Input
                          placeholder="Mathematics, Physics"
                          value={newTeacherForm.subjects}
                          onChange={(e) =>
                            setNewTeacherForm({
                              ...newTeacherForm,
                              subjects: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Qualification *</Label>
                        <Input
                          placeholder="M.Sc., B.Ed"
                          value={newTeacherForm.qualification}
                          onChange={(e) =>
                            setNewTeacherForm({
                              ...newTeacherForm,
                              qualification: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Experience (years) *</Label>
                        <Input
                          type="number"
                          placeholder="5"
                          value={newTeacherForm.experience_years}
                          onChange={(e) =>
                            setNewTeacherForm({
                              ...newTeacherForm,
                              experience_years: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Joining Date</Label>
                        <Input
                          type="date"
                          value={newTeacherForm.joining_date}
                          onChange={(e) =>
                            setNewTeacherForm({
                              ...newTeacherForm,
                              joining_date: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={submitting.teacher}
                    >
                      {submitting.teacher ? "Adding Teacher..." : "Add Teacher"}
                    </Button>
                  </div>
                </form>

                {/* Teachers List */}
                <div>
                  <h4 className="font-medium mb-4">All Teachers</h4>
                  {loading.teachers ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                      <span className="ml-2 text-muted-foreground">
                        Loading teachers...
                      </span>
                    </div>
                  ) : teachers.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      No teachers found
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Subject</TableHead>
                          <TableHead>Classes</TableHead>
                          <TableHead>Students</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {teachers.map((teacher, index) => (
                          <TableRow key={teacher.id || index}>
                            <TableCell className="font-medium">
                              {teacher.name || teacher.full_name || "N/A"}
                            </TableCell>
                            <TableCell>
                              {teacher.subject || teacher.subjects || "N/A"}
                            </TableCell>
                            <TableCell>
                              {teacher.classes_count || teacher.classes || 0}
                            </TableCell>
                            <TableCell>
                              {teacher.students_count || teacher.students || 0}
                            </TableCell>
                            <TableCell>
                              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                                {teacher.status || "Active"}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
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
                <form onSubmit={handleCreateClass}>
                  <div className="p-6 border-2 border-border rounded-xl space-y-4">
                    <h4 className="font-medium">Create New Class</h4>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Grade *</Label>
                        <Input
                          placeholder="e.g., 10"
                          type="number"
                          value={newClassForm.grade}
                          onChange={(e) =>
                            setNewClassForm({
                              ...newClassForm,
                              grade: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Section *</Label>
                        <Input
                          placeholder="e.g., A"
                          value={newClassForm.section}
                          onChange={(e) =>
                            setNewClassForm({
                              ...newClassForm,
                              section: e.target.value.toUpperCase(),
                            })
                          }
                          maxLength={1}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Class Teacher</Label>
                        <Select
                          value={newClassForm.classTeacherId || "none"}
                          onValueChange={(value) =>
                            setNewClassForm({
                              ...newClassForm,
                              classTeacherId: value === "none" ? "" : value,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select teacher (optional)" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">Select</SelectItem>
                            {loading.teachers ? (
                              <SelectItem value="loading" disabled>
                                Loading teachers...
                              </SelectItem>
                            ) : teachers.length === 0 ? (
                              <SelectItem value="no-teachers" disabled>
                                No teachers available
                              </SelectItem>
                            ) : (
                              teachers.map((teacher) => (
                                <SelectItem key={teacher.id} value={teacher.id}>
                                  {teacher.name ||
                                    teacher.full_name ||
                                    `Teacher ${teacher.id.substring(0, 8)}`}
                                  {teacher.subject
                                    ? ` - ${teacher.subject}`
                                    : ""}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={submitting.class}
                    >
                      {submitting.class ? "Creating Class..." : "Create Class"}
                    </Button>
                  </div>
                </form>

                {/* Classes Grid */}
                <div>
                  <h4 className="font-medium mb-4">All Classes</h4>
                  {loading.classes ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                      <span className="ml-2 text-muted-foreground">
                        Loading classes...
                      </span>
                    </div>
                  ) : classes.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      No classes found
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-3 gap-4">
                      {classes.map((classItem) => {
                        // Find teacher name if class_teacher_id exists
                        const classTeacher = classItem.class_teacher_id
                          ? teachers.find(
                              (t) => t.id === classItem.class_teacher_id
                            )
                          : null;

                        return (
                          <Card
                            key={classItem.id}
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
                                  Class Teacher
                                </p>
                                <p className="text-sm font-medium">
                                  {classTeacher
                                    ? classTeacher.name ||
                                      classTeacher.full_name ||
                                      "Assigned"
                                    : "Not Assigned"}
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
