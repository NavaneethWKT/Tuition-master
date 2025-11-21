import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  ArrowLeft,
  FileText,
  Download,
  Eye,
  Search,
  Filter,
  BookOpen,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { usePdf } from "../contexts/PdfContext";
import { useAuth } from "../contexts/AuthContext";

export function ClassNotes() {
  const navigate = useNavigate();
  const { setPdf } = usePdf();
  const { userRole } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");

  // Mock class information
  const classInfo = {
    grade: "10",
    section: "A",
    classTeacher: "Dr. Rajesh Sharma",
  };

  // Mock uploaded notes by teachers
  const classNotes = [
    {
      id: 1,
      title: "Algebra - Chapter 5 Complete Notes",
      subject: "Mathematics",
      teacher: "Dr. Rajesh Sharma",
      uploadDate: "Nov 20, 2025",
      size: "2.4 MB",
      type: "PDF",
      downloads: 28,
      fileUrl:
        "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    },
    {
      id: 2,
      title: "Linear Equations - Practice Problems",
      subject: "Mathematics",
      teacher: "Dr. Rajesh Sharma",
      uploadDate: "Nov 18, 2025",
      size: "1.8 MB",
      type: "PDF",
      downloads: 32,
      fileUrl:
        "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    },
    {
      id: 3,
      title: "Laws of Motion - Detailed Explanation",
      subject: "Physics",
      teacher: "Prof. Priya Kumar",
      uploadDate: "Nov 17, 2025",
      size: "3.2 MB",
      type: "PDF",
      downloads: 30,
      fileUrl:
        "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    },
    {
      id: 4,
      title: "Chemical Reactions - Lab Notes",
      subject: "Chemistry",
      teacher: "Ms. Anita Singh",
      uploadDate: "Nov 15, 2025",
      size: "2.1 MB",
      type: "PDF",
      downloads: 25,
      fileUrl:
        "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    },
    {
      id: 5,
      title: "Cell Biology - Diagrams & Notes",
      subject: "Biology",
      teacher: "Mr. Vikram Patel",
      uploadDate: "Nov 14, 2025",
      size: "4.5 MB",
      type: "PDF",
      downloads: 27,
      fileUrl:
        "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    },
    {
      id: 6,
      title: "Trigonometry Formulas - Quick Reference",
      subject: "Mathematics",
      teacher: "Dr. Rajesh Sharma",
      uploadDate: "Nov 12, 2025",
      size: "856 KB",
      type: "PDF",
      downloads: 35,
      fileUrl:
        "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    },
    {
      id: 7,
      title: "Electricity & Circuits - Study Guide",
      subject: "Physics",
      teacher: "Prof. Priya Kumar",
      uploadDate: "Nov 10, 2025",
      size: "2.8 MB",
      type: "PDF",
      downloads: 29,
      fileUrl:
        "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    },
    {
      id: 8,
      title: "Periodic Table - Complete Notes",
      subject: "Chemistry",
      teacher: "Ms. Anita Singh",
      uploadDate: "Nov 8, 2025",
      size: "1.5 MB",
      type: "PDF",
      downloads: 31,
      fileUrl:
        "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    },
  ];

  const subjects = ["all", "Mathematics", "Physics", "Chemistry", "Biology"];

  const filteredNotes = classNotes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.teacher.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject =
      selectedSubject === "all" || note.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const subjectColors: Record<string, { bg: string; text: string }> = {
    Mathematics: { bg: "bg-blue-100", text: "text-blue-700" },
    Physics: { bg: "bg-purple-100", text: "text-purple-700" },
    Chemistry: { bg: "bg-green-100", text: "text-green-700" },
    Biology: { bg: "bg-orange-100", text: "text-orange-700" },
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/student/dashboard")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h2 className="text-gray-800">Class Notes & Materials</h2>
            <p className="text-sm text-muted-foreground">
              Grade {classInfo.grade} - Section {classInfo.section} • Class
              Teacher: {classInfo.classTeacher}
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 max-w-6xl space-y-6">
        {/* Class Info Card */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white mb-2">Your Class</h3>
                <p className="text-blue-100 mb-4">
                  Access all study materials uploaded by your teachers
                </p>
                <div className="flex gap-6 text-sm">
                  <div>
                    <p className="text-blue-100">Total Notes</p>
                    <p className="text-2xl font-bold">{classNotes.length}</p>
                  </div>
                  <div>
                    <p className="text-blue-100">Subjects</p>
                    <p className="text-2xl font-bold">4</p>
                  </div>
                  <div>
                    <p className="text-blue-100">Latest Update</p>
                    <p className="text-2xl font-bold">Today</p>
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
        <div className="grid md:grid-cols-2 gap-6">
          {filteredNotes.map((note) => {
            const colors = subjectColors[note.subject] || {
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
                          {note.subject}
                        </span>
                      </div>
                    </div>
                  </div>
                  <CardTitle className="text-lg">{note.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center justify-between">
                      <span>Uploaded by:</span>
                      <span className="font-medium text-foreground">
                        {note.teacher}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Date:</span>
                      <span className="font-medium text-foreground">
                        {note.uploadDate}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Size:</span>
                      <span className="font-medium text-foreground">
                        {note.size}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Downloads:</span>
                      <span className="font-medium text-foreground">
                        {note.downloads}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t">
                    <Button variant="outline" className="flex-1 gap-2">
                      <Eye className="w-4 h-4" />
                      View
                    </Button>
                    <Button variant="outline" className="flex-1 gap-2">
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                    <Button
                      className="flex-1 gap-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                      onClick={() => {
                        if (note.fileUrl) {
                          setPdf(note.fileUrl, note.title);
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

        {filteredNotes.length === 0 && (
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
    </div>
  );
}
