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
  X,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
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
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState({
    statistics: false,
    classes: false,
    materials: false,
    subjects: false,
  });

  // State for upload form
  const [uploadForm, setUploadForm] = useState({
    file: null as File | null,
    selectedClass: "",
    selectedSubject: "",
    title: "",
    description: "",
    showForm: false,
  });
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Get teacher ID from userData
  const teacherId = userData?.id;

  // Fetch statistics when component mounts
  useEffect(() => {
    if (teacherId) {
      fetchStatistics();
    }
  }, [teacherId]);

  // Fetch classes when overview tab is active OR when materials tab is active (for upload form)
  useEffect(() => {
    if (teacherId && (activeTab === "overview" || activeTab === "materials")) {
      fetchClasses();
    }
  }, [teacherId, activeTab]);

  // Fetch materials when materials tab is active
  useEffect(() => {
    if (teacherId && activeTab === "materials") {
      fetchMaterials();
      fetchSubjects();
    }
  }, [teacherId, activeTab]);

  // Fetch subjects when upload form is shown
  useEffect(() => {
    if (teacherId && uploadForm.showForm && subjects.length === 0) {
      fetchSubjects();
    }
  }, [teacherId, uploadForm.showForm]);

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

  // Fetch teacher subjects
  const fetchSubjects = async () => {
    if (!teacherId) return;
    setLoading((prev) => ({ ...prev, subjects: true }));
    try {
      const response = await apiClient.getTeacherSubjects(teacherId);
      setSubjects(Array.isArray(response?.subjects) ? response.subjects : []);
    } catch (error) {
      console.error("Error fetching teacher subjects:", error);
    } finally {
      setLoading((prev) => ({ ...prev, subjects: false }));
    }
  };

  const handleViewMaterial = (url: string) => {
    window.open(url, "_blank");
  };

  const handleDeleteMaterial = (index: number) => {
    setMaterials((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadForm({
        ...uploadForm,
        file,
        title: file.name.replace(/\.[^/.]+$/, ""), // Use filename without extension as default title
        showForm: true,
      });
    }
  };

  const handleRemoveFile = () => {
    setUploadForm({
      file: null,
      selectedClass: "",
      selectedSubject: "",
      title: "",
      description: "",
      showForm: false,
    });
  };

  // Convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = (reader.result as string).split(",")[1]; // Remove data:type;base64, prefix
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmitMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError(null);

    if (
      !uploadForm.file ||
      !uploadForm.selectedClass ||
      !uploadForm.selectedSubject ||
      !uploadForm.title ||
      !teacherId
    ) {
      setUploadError("Please fill all required fields");
      return;
    }

    setUploading(true);

    try {
      // Convert file to base64
      const fileUrl = await fileToBase64(uploadForm.file);

      // Get filename without extension for the filename field
      const filename = uploadForm.file.name.replace(/\.[^/.]+$/, "");

      // Prepare request body
      const requestBody = {
        fileUrl: fileUrl,
        filename: filename,
        folder: "tuition_master/documents",
        class_id: uploadForm.selectedClass,
        subject_id: uploadForm.selectedSubject,
        teacher_id: teacherId,
        title: uploadForm.title,
        description: uploadForm.description || "",
      };

      // Call upload API
      await apiClient.uploadDocument(requestBody);

      // Refresh materials list after successful upload
      await fetchMaterials();

      // Reset form
      handleRemoveFile();

      alert("Material uploaded successfully!");
    } catch (error: any) {
      console.error("Error uploading material:", error);
      setUploadError(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to upload material. Please try again."
      );
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
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
                        <input
                          id="file-upload"
                          type="file"
                          className="hidden"
                          onChange={handleFileSelect}
                          accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                        />
                        <Button
                          variant="outline"
                          onClick={() =>
                            document.getElementById("file-upload")?.click()
                          }
                        >
                          Browse Files
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Upload Form - Shows when file is selected */}
                  {uploadForm.showForm && uploadForm.file && (
                    <Card className="border-2 border-primary/20 shadow-md">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle>Upload Material Details</CardTitle>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleRemoveFile}
                            disabled={uploading}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {uploadError && (
                          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-sm text-red-600">
                              {uploadError}
                            </p>
                          </div>
                        )}
                        <form
                          onSubmit={handleSubmitMaterial}
                          className="space-y-4"
                        >
                          {/* Class Dropdown */}
                          <div className="space-y-2">
                            <Label htmlFor="class-select">Class *</Label>
                            <Select
                              value={uploadForm.selectedClass}
                              onValueChange={(value) =>
                                setUploadForm({
                                  ...uploadForm,
                                  selectedClass: value,
                                })
                              }
                            >
                              <SelectTrigger id="class-select">
                                <SelectValue placeholder="Select a class" />
                              </SelectTrigger>
                              <SelectContent>
                                {loading.classes ? (
                                  <SelectItem value="loading" disabled>
                                    Loading classes...
                                  </SelectItem>
                                ) : classes.length === 0 ? (
                                  <SelectItem value="none" disabled>
                                    No classes available
                                  </SelectItem>
                                ) : (
                                  classes.map((classItem) => (
                                    <SelectItem
                                      key={classItem.id}
                                      value={classItem.id}
                                    >
                                      Grade {classItem.grade} - Section{" "}
                                      {classItem.section}
                                    </SelectItem>
                                  ))
                                )}
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Subject Dropdown */}
                          <div className="space-y-2">
                            <Label htmlFor="subject-select">Subject *</Label>
                            <Select
                              value={uploadForm.selectedSubject}
                              onValueChange={(value) =>
                                setUploadForm({
                                  ...uploadForm,
                                  selectedSubject: value,
                                })
                              }
                            >
                              <SelectTrigger id="subject-select">
                                <SelectValue placeholder="Select a subject" />
                              </SelectTrigger>
                              <SelectContent>
                                {loading.subjects ? (
                                  <SelectItem value="loading" disabled>
                                    Loading subjects...
                                  </SelectItem>
                                ) : subjects.length === 0 ? (
                                  <SelectItem value="none" disabled>
                                    No subjects available
                                  </SelectItem>
                                ) : (
                                  subjects.map((subject: any) => (
                                    <SelectItem
                                      key={subject.subject_id}
                                      value={subject.subject_id}
                                    >
                                      {subject.name}
                                    </SelectItem>
                                  ))
                                )}
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Title */}
                          <div className="space-y-2">
                            <Label htmlFor="material-title">Title *</Label>
                            <Input
                              id="material-title"
                              placeholder="Enter material title"
                              value={uploadForm.title}
                              onChange={(e) =>
                                setUploadForm({
                                  ...uploadForm,
                                  title: e.target.value,
                                })
                              }
                              required
                            />
                          </div>

                          {/* Description */}
                          <div className="space-y-2">
                            <Label htmlFor="material-description">
                              Description (Optional)
                            </Label>
                            <Textarea
                              id="material-description"
                              placeholder="Enter material description"
                              value={uploadForm.description}
                              onChange={(e) =>
                                setUploadForm({
                                  ...uploadForm,
                                  description: e.target.value,
                                })
                              }
                              rows={3}
                            />
                          </div>

                          {/* Attachment Preview */}
                          <div className="space-y-2">
                            <Label>Attachment</Label>
                            <div className="border rounded-lg p-4 bg-muted/50">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                    <FileText className="w-5 h-5 text-primary" />
                                  </div>
                                  <div>
                                    <p className="font-medium text-sm">
                                      {uploadForm.file.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {formatFileSize(uploadForm.file.size)} •{" "}
                                      {uploadForm.file.type || "Unknown type"}
                                    </p>
                                  </div>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={handleRemoveFile}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>

                          {/* Submit Button */}
                          <div className="flex gap-3 pt-2">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={handleRemoveFile}
                              className="flex-1"
                              disabled={uploading}
                            >
                              Cancel
                            </Button>
                            <Button
                              type="submit"
                              disabled={
                                uploading ||
                                !uploadForm.selectedClass ||
                                !uploadForm.selectedSubject ||
                                !uploadForm.title ||
                                !uploadForm.file
                              }
                              className="flex-1"
                            >
                              {uploading ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  Uploading...
                                </>
                              ) : (
                                "Upload Material"
                              )}
                            </Button>
                          </div>
                        </form>
                      </CardContent>
                    </Card>
                  )}

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
                                  onClick={async () => {
                                    const resp = await apiClient.viewDocument(
                                      material.public_id
                                    );
                                    console.log(JSON.stringify(resp));
                                    handleViewMaterial(resp.url);
                                  }}
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
