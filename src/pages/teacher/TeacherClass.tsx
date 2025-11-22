import { useParams, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/card";
import { AddStudentDialog } from "../../components/AddStudentDialog";
import { DashboardHeader } from "../../components/DashboardHeader";
import { BookOpen, ArrowLeft, Loader2 } from "lucide-react";
import apiClient from "../../services/apiClient";
import { useAuth } from "../../contexts/AuthContext";

export function TeacherClass() {
  const { id: classId } = useParams();
  const navigate = useNavigate();
  const { userData } = useAuth();

  const [students, setStudents] = useState<any[]>([]);
  const [classDetails, setClassDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [schoolId, setSchoolId] = useState<string | null>(null);

  // Fetch students when component mounts
  useEffect(() => {
    if (classId) {
      fetchStudents();
      fetchClassSchoolId();
    }
  }, [classId]);

  // Fetch school_id from teacher's classes
  const fetchClassSchoolId = async () => {
    if (!classId || !userData?.id) return;
    try {
      const classes = await apiClient.getTeacherClasses(userData.id);
      const matchingClass = Array.isArray(classes)
        ? classes.find((c: any) => c.id === classId)
        : null;
      if (matchingClass?.school_id) {
        setSchoolId(matchingClass.school_id);
      }
    } catch (err) {
      console.error("Error fetching class details:", err);
    }
  };

  // Update schoolId when students are loaded (fallback)
  useEffect(() => {
    if (!schoolId && students.length > 0 && students[0].school_id) {
      setSchoolId(students[0].school_id);
    }
  }, [students, schoolId]);

  // Fetch students for this class
  const fetchStudents = async () => {
    if (!classId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.getClassStudents(classId);
      setStudents(Array.isArray(response) ? response : []);
    } catch (err: any) {
      console.error("Error fetching class students:", err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to fetch students. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async () => {
    // Refresh students list after adding
    if (classId) {
      await fetchStudents();
    }
  };

  // Format date of birth
  const formatDateOfBirth = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
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

      <div className="container mx-auto px-6 py-8 space-y-6">
        {/* Top Header with Back Button */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/teacher/dashboard")}
            className="rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-semibold">Class Details</h1>
        </div>

        <Card className="shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">
                Students in this Class
              </CardTitle>
              <AddStudentDialog
                classId={classId || ""}
                schoolId={schoolId || ""}
                onAddStudent={handleAddStudent}
              />
            </div>
          </CardHeader>

          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">
                  Loading students...
                </span>
              </div>
            ) : students.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No students found in this class
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr className="text-left">
                      <th className="p-3 font-medium">Name</th>
                      <th className="p-3 font-medium">Date of Birth</th>
                      <th className="p-3 font-medium">Contact</th>
                      <th className="p-3 font-medium">Email</th>
                      <th className="p-3 font-medium">Roll No</th>
                    </tr>
                  </thead>

                  <tbody>
                    {students.map((student) => (
                      <tr
                        key={student.id}
                        className="border-t hover:bg-muted/30 transition-colors"
                      >
                        <td className="p-3">{student.full_name || "N/A"}</td>
                        <td className="p-3">
                          {formatDateOfBirth(student.date_of_birth)}
                        </td>
                        <td className="p-3">{student.phone || "N/A"}</td>
                        <td className="p-3">{student.email || "N/A"}</td>
                        <td className="p-3 text-muted-foreground">
                          {student.roll_number || "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
