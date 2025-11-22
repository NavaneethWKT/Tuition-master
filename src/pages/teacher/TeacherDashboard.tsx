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
import { Textarea } from "../../components/ui/textarea";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import {
  BookOpen,
  Upload,
  FileText,
  Users,
  LogOut,
  PlusCircle,
  Loader2,
} from "lucide-react";
import { DashboardHeader } from "../../components/DashboardHeader";
import { StatCard } from "../../components/StatCard";
import { useAuth } from "../../contexts/AuthContext";
import apiClient from "../../services/apiClient";

export function TeacherDashboard() {
  const navigate = useNavigate();
  const { userData } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  // State for API data
  const [statistics, setStatistics] = useState<any>(null);
  const [classes, setClasses] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState({
    statistics: false,
    classes: false,
    materials: false,
  });

  // Get teacher ID from userData
  const teacherId = userData?.id;

  // Fetch statistics when component mounts
  useEffect(() => {
    if (teacherId) {
      fetchStatistics();
    }
  }, [teacherId]);

  // Fetch classes when overview tab is active
  useEffect(() => {
    if (teacherId && activeTab === "overview") {
      fetchClasses();
    }
  }, [teacherId, activeTab]);

  // Fetch materials when materials tab is active
  useEffect(() => {
    if (teacherId && activeTab === "materials") {
      fetchMaterials();
    }
  }, [teacherId, activeTab]);

  // Fetch teacher statistics
  const fetchStatistics = async () => {
    if (!teacherId) return;
    setLoading((prev) => ({ ...prev, statistics: true }));
    try {
      const response = await apiClient.getTeacherStatistics(teacherId);
      setStatistics(response);
    } catch (error) {
      console.error("Error fetching teacher statistics:", error);
    } finally {
      setLoading((prev) => ({ ...prev, statistics: false }));
    }
  };

  // Fetch teacher classes
  const fetchClasses = async () => {
    if (!teacherId) return;
    setLoading((prev) => ({ ...prev, classes: true }));
    try {
      const response = await apiClient.getTeacherClasses(teacherId);
      setClasses(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error("Error fetching teacher classes:", error);
    } finally {
      setLoading((prev) => ({ ...prev, classes: false }));
    }
  };

  // Fetch teacher materials
  const fetchMaterials = async () => {
    if (!teacherId) return;
    setLoading((prev) => ({ ...prev, materials: true }));
    try {
      const response = await apiClient.getTeacherMaterials(teacherId);
      setMaterials(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error("Error fetching teacher materials:", error);
    } finally {
      setLoading((prev) => ({ ...prev, materials: false }));
    }
  };

  const handleViewMaterial = (url: string) => {
    window.open(url, "_blank");
  };

  const handleDeleteMaterial = (index: number) => {
    setMaterials((prev) => prev.filter((_, i) => i !== index));
  };
  return (
    <div className="min-h-screen bg-paper">
      <DashboardHeader
        title="Tuition Master"
        subtitle="Teacher Portal"
        icon={
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
        }
      />

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 space-y-6">
        {/* Greeting */}
        <div>
          <h1 className="text-gray-800 mb-2">
            Welcome, {userData?.name ? userData.name.split(" ")[0] : "Teacher"}{" "}
            👨‍🏫
          </h1>
          <p className="text-muted-foreground">
            Manage your classes, materials, and track student progress
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6">
          <StatCard
            label="Total Students"
            value={
              loading.statistics
                ? "..."
                : statistics?.total_students?.toLocaleString() || "0"
            }
            icon={Users}
            iconBg="bg-blue-100"
            iconColor="text-blue-600"
          />
          <StatCard
            label="Total Classes"
            value={
              loading.statistics
                ? "..."
                : statistics?.total_classes?.toLocaleString() || "0"
            }
            icon={BookOpen}
            iconBg="bg-green-100"
            iconColor="text-green-600"
          />
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
            <div className="grid md:grid-cols-1 gap-6">
              {/* Recent Classes */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle>Your Classes</CardTitle>
                </CardHeader>
                <CardContent>
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
                    <div className="space-y-4">
                      {classes.map((classItem) => (
                        <div
                          key={classItem.id}
                          className="p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">
                                Grade {classItem.grade} - Section{" "}
                                {classItem.section}
                              </p>
                            </div>
                            <Button
                              size="sm"
                              onClick={() =>
                                navigate(`/teacher/class/${classItem.id}`)
                              }
                            >
                              View
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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
                      </div>
                    </div>
                  </div>

                  {/* Uploaded Materials List */}
                  <div className="space-y-3 mt-6">
                    <h4 className="font-medium">Uploaded Materials</h4>
                    {loading.materials ? (
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                        <span className="ml-2 text-muted-foreground">
                          Loading materials...
                        </span>
                      </div>
                    ) : materials.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        No materials found
                      </div>
                    ) : (
                      materials.map((material, index) => {
                        // Format file size
                        const formatFileSize = (bytes: number) => {
                          if (!bytes) return "Unknown size";
                          const mb = bytes / (1024 * 1024);
                          if (mb >= 1) return `${mb.toFixed(2)} MB`;
                          const kb = bytes / 1024;
                          return `${kb.toFixed(2)} KB`;
                        };

                        // Format date
                        const formatDate = (dateString: string) => {
                          if (!dateString) return "Unknown date";
                          const date = new Date(dateString);
                          return date.toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          });
                        };

                        return (
                          <div
                            key={material.id || index}
                            className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                <FileText className="w-5 h-5 text-red-600" />
                              </div>
                              <div>
                                <p className="font-medium">
                                  {material.title || "Untitled Material"}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {formatDate(
                                    material.upload_date || material.created_at
                                  )}{" "}
                                  • {formatFileSize(material.file_size)}
                                  {material.file_type
                                    ? ` • ${material.file_type}`
                                    : ""}
                                </p>
                                {material.description && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {material.description}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                              {material.file_url && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleViewMaterial(material.file_url)
                                  }
                                >
                                  View
                                </Button>
                              )}

                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteMaterial(index)}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        );
                      })
                    )}
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
