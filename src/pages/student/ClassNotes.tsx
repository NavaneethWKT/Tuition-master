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
import {
  FileText,
  Download,
  Eye,
  Search,
  Filter,
  BookOpen,
  Loader2,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { usePdf } from "../../contexts/PdfContext";
import { useAuth } from "../../contexts/AuthContext";
import { PageHeader } from "../../components/PageHeader";
import apiClient from "../../services/apiClient";

export function ClassNotes() {
  const navigate = useNavigate();
  const { setPdf } = usePdf();
  const { userData } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");

  const [materials, setMaterials] = useState<any[]>([]);
  const [totalMaterials, setTotalMaterials] = useState(0);
  const [totalSubjects, setTotalSubjects] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State for PDF viewer modal
  const [pdfViewer, setPdfViewer] = useState<{
    open: boolean;
    url: string | null;
    title: string | null;
  }>({
    open: false,
    url: null,
    title: null,
  });

  useEffect(() => {
    if (userData?.id) {
      fetchClassMaterials();
    }
  }, [userData?.id]);

  const fetchClassMaterials = async () => {
    if (!userData?.id) return;
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.getStudentClassMaterials(userData.id);
      setMaterials(Array.isArray(response.materials) ? response.materials : []);
      setTotalMaterials(response.total_materials || 0);
      setTotalSubjects(response.total_subjects || 0);
    } catch (err: any) {
      console.error("Error fetching class materials:", err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to fetch class materials. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Get unique subjects from materials
  const subjects = [
    "all",
    ...Array.from(
      new Set(materials.map((m) => m.subject_name).filter(Boolean))
    ),
  ];

  const filteredNotes = materials.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (note.subject_name &&
        note.subject_name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSubject =
      selectedSubject === "all" || note.subject_name === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (!bytes || bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const subjectColors: Record<string, { bg: string; text: string }> = {
    Mathematics: { bg: "bg-blue-100", text: "text-blue-700" },
    Physics: { bg: "bg-purple-100", text: "text-purple-700" },
    Chemistry: { bg: "bg-green-100", text: "text-green-700" },
    Biology: { bg: "bg-orange-100", text: "text-orange-700" },
  };

  return (
    <div className="min-h-screen bg-paper">
      <PageHeader
        title="Class Notes & Materials"
        subtitle="Access all study materials uploaded by your teachers"
        showBackButton={true}
        backRoute="/student/dashboard"
      />

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 max-w-6xl space-y-6">
        {/* Class Info Card */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="py-6">
            {error && (
              <div className="mb-4 p-3 bg-white/20 rounded-md border border-white/30">
                <p className="text-sm text-white">{error}</p>
              </div>
            )}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white mb-2">Your Class</h3>
                <p className="text-blue-100 mb-4">
                  Access all study materials uploaded by your teachers
                </p>
                <div className="flex gap-6 text-sm">
                  <div>
                    <p className="text-blue-100">Total Notes</p>
                    <p className="text-2xl font-bold">
                      {loading ? "..." : totalMaterials}
                    </p>
                  </div>
                  <div>
                    <p className="text-blue-100">Subjects</p>
                    <p className="text-2xl font-bold">
                      {loading ? "..." : totalSubjects}
                    </p>
                  </div>
                </div>
              </div>
              <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center">
                <FileText className="w-12 h-12 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search and Filter */}
        <Card className="shadow-lg border-0">
          <CardContent className="py-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search notes by title or teacher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select
                value={selectedSubject}
                onValueChange={setSelectedSubject}
              >
                <SelectTrigger className="w-full md:w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {subjects.slice(1).map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notes Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">
              Loading materials...
            </span>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredNotes.map((note) => {
              const subjectName = note.subject_name || "Unknown";
              const colors = subjectColors[subjectName] || {
                bg: "bg-gray-100",
                text: "text-gray-700",
              };

              return (
                <Card
                  key={note.id}
                  className="shadow-lg border-0 hover:shadow-xl transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-10 h-10 ${colors.bg} rounded-lg flex items-center justify-center`}
                        >
                          <FileText className={`w-5 h-5 ${colors.text}`} />
                        </div>
                        <div>
                          <span
                            className={`text-xs px-2 py-1 ${colors.bg} ${colors.text} rounded-full font-medium`}
                          >
                            {subjectName}
                          </span>
                        </div>
                      </div>
                    </div>
                    <CardTitle className="text-lg">{note.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {note.description || "Description unavailable"}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center justify-between">
                        <span>Type:</span>
                        <span className="font-medium text-foreground">
                          {note.file_type || "NA"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Date:</span>
                        <span className="font-medium text-foreground">
                          {formatDate(note.upload_date) || "NA"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Size:</span>
                        <span className="font-medium text-foreground">
                          {formatFileSize(note.file_size) || "NA"}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4 border-t">
                      <Button
                        variant="outline"
                        className="flex-1 gap-2"
                        onClick={() => {
                          if (note.file_url) {
                            // Clean up the URL (remove trailing ? if present)
                            const cleanUrl = note.file_url.endsWith("?")
                              ? note.file_url.slice(0, -1)
                              : note.file_url;
                            setPdfViewer({
                              open: true,
                              url: cleanUrl,
                              title: note.title,
                            });
                          }
                        }}
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 gap-2"
                        onClick={() => {
                          if (note.file_url) {
                            const link = document.createElement("a");
                            link.href = note.file_url;
                            link.download = note.title || "download";
                            link.target = "_blank";
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          }
                        }}
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </Button>
                      <Button
                        className="flex-1 gap-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                        onClick={() => {
                          if (note.file_url) {
                            setPdf(note.file_url, note.title);
                            navigate("/student/ai-chat");
                          }
                        }}
                      >
                        <BookOpen className="w-4 h-4" />
                        Learn
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {!loading && filteredNotes.length === 0 && (
          <Card className="shadow-lg border-0">
            <CardContent className="py-12">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto">
                  <FileText className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">
                  No notes found matching your search criteria
                </p>
                <Button variant="outline" onClick={() => setSearchQuery("")}>
                  Clear Search
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      {/* PDF Viewer Modal */}
      <Dialog
        open={pdfViewer.open}
        onOpenChange={(open) => setPdfViewer({ ...pdfViewer, open })}
      >
        <DialogContent className="max-w-6xl w-full h-[90vh] p-0 flex flex-col">
          <DialogHeader className="px-6 pt-6 pb-4 border-b shrink-0">
            <div className="flex items-center justify-between">
              <DialogTitle>{pdfViewer.title || "PDF Viewer"}</DialogTitle>
              {pdfViewer.url && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(pdfViewer.url || "", "_blank")}
                >
                  Open in New Tab
                </Button>
              )}
            </div>
          </DialogHeader>
          <div className="flex-1 overflow-hidden bg-gray-100 relative">
            {pdfViewer.url && (
              <div className="w-full h-full flex flex-col">
                {/* Use Google Docs viewer - handles CORS better */}
                <iframe
                  src={`https://docs.google.com/viewer?url=${encodeURIComponent(
                    pdfViewer.url
                  )}&embedded=true`}
                  className="flex-1 w-full border-0"
                  title={pdfViewer.title || "PDF Document"}
                  style={{ minHeight: "calc(90vh - 120px)" }}
                  allow="fullscreen"
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
