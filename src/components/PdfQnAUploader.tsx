import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Progress } from "./ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  FileText,
  CheckCircle2,
  XCircle,
  Sparkles,
  Loader2,
  Award,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import apiClient from "../services/apiClient";

interface QnA {
  question: string;
  answer: string;
  id: string;
}

interface Props {
  role: "parent" | "student";
}

export default function PdfQnAUploader({ role }: Props) {
  const { userData } = useAuth();
  const [qna, setQna] = useState<QnA[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>("");
  const [selectedMaterial, setSelectedMaterial] = useState<any | null>(null);
  const [materials, setMaterials] = useState<any[]>([]);
  const [loadingMaterials, setLoadingMaterials] = useState(false);
  const [materialsError, setMaterialsError] = useState<string | null>(null);
  const [studentId, setStudentId] = useState<string | null>(null);
  const [studentAnswers, setStudentAnswers] = useState<{
    [qId: string]: string;
  }>({});
  const [parentMarkings, setParentMarkings] = useState<{
    [qId: string]: "right" | "wrong" | null;
  }>({});

  // Ensure role is properly typed
  const isParent = role === "parent";
  const isStudent = role === "student";

  // Fetch student ID for parent or use own ID for student
  useEffect(() => {
    if (isStudent && userData?.id) {
      setStudentId(userData.id);
    } else if (isParent && userData?.id) {
      fetchParentStudent();
    }
  }, [role, userData?.id]);

  // Fetch materials when studentId is available
  useEffect(() => {
    if (studentId) {
      fetchMaterials();
    }
  }, [studentId]);

  const fetchParentStudent = async () => {
    if (!userData?.id) return;
    try {
      const response = await apiClient.getParentStudent(userData.id);
      if (response?.id) {
        setStudentId(response.id);
      }
    } catch (err: any) {
      console.error("Error fetching parent's student:", err);
      setMaterialsError(
        "Failed to fetch student information. Please try again."
      );
    }
  };

  const fetchMaterials = async () => {
    if (!studentId) return;
    setLoadingMaterials(true);
    setMaterialsError(null);
    try {
      const response = await apiClient.getStudentClassMaterials(studentId);
      setMaterials(
        Array.isArray(response?.materials) ? response.materials : []
      );
    } catch (err: any) {
      console.error("Error fetching materials:", err);
      setMaterialsError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to fetch materials. Please try again."
      );
    } finally {
      setLoadingMaterials(false);
    }
  };

  const handleMaterialSelect = (materialId: string) => {
    setSelectedMaterialId(materialId);
    const material = materials.find((m) => m.id === materialId);
    setSelectedMaterial(material || null);
    // Reset QnA when material changes
    setQna([]);
    setStudentAnswers({});
    setParentMarkings({});
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes || bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const generateQuestions = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMaterialId) return;
    setLoading(true);
    setUploadProgress(0);

    // Simulate processing progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 10;
      });
    }, 200);

    try {
      const response = await apiClient.generateExamQuestions(
        selectedMaterialId
      );

      // Handle response - adjust based on actual API response structure
      // Assuming response contains questions array or qna array
      const questions = response.questions || response.qna || [];

      // Ensure each question has a unique ID
      const questionsWithIds = questions.map((q: any, index: number) => ({
        ...q,
        id: q.id || `question-${index}-${Date.now()}-${Math.random()}`,
      }));

      setUploadProgress(100);
      setTimeout(() => {
        setQna(questionsWithIds);
        setLoading(false);
        setUploadProgress(0);
      }, 500);
    } catch (error: any) {
      console.error("Error generating questions:", error);
      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to generate questions. Please try again."
      );
      setLoading(false);
      setUploadProgress(0);
    }
    clearInterval(progressInterval);
  };

  const resetTest = () => {
    setQna([]);
    setSelectedMaterialId("");
    setSelectedMaterial(null);
    setStudentAnswers({});
    setParentMarkings({});
    setUploadProgress(0);
  };

  const getStats = () => {
    if (isParent) {
      const total = qna.length;
      const marked = Object.values(parentMarkings).filter(
        (m) => m !== null
      ).length;
      const correct = Object.values(parentMarkings).filter(
        (m) => m === "right"
      ).length;
      return { total, marked, correct };
    } else {
      const total = qna.length;
      const answered = Object.values(studentAnswers).filter(
        (a) => typeof a === "string" && a.trim() !== ""
      ).length;
      return { total, answered };
    }
  };

  const stats = getStats();

  return (
    <div className="space-y-6">
      {/* Material Selection Section */}
      {qna.length === 0 && (
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              Select Material to Generate Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={generateQuestions} className="space-y-6">
              {materialsError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{materialsError}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-sm font-medium">Select Material *</Label>
                <Select
                  value={selectedMaterialId}
                  onValueChange={handleMaterialSelect}
                  disabled={loadingMaterials}
                >
                  <SelectTrigger
                    className="w-full"
                    style={{
                      height: "40px",
                      minHeight: "30px",
                      marginTop: 10,
                    }}
                  >
                    <SelectValue placeholder="Choose a material from class notes">
                      {selectedMaterial && (
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-primary shrink-0" />
                          <span className="truncate">
                            {selectedMaterial.title || "Untitled"}
                          </span>
                        </div>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {loadingMaterials ? (
                      <SelectItem
                        value="loading"
                        disabled
                        className="h-12 py-3"
                      >
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                          <span>Loading materials...</span>
                        </div>
                      </SelectItem>
                    ) : materials.length === 0 ? (
                      <SelectItem value="none" disabled className="h-12 py-3">
                        No materials available
                      </SelectItem>
                    ) : (
                      materials.map((material) => (
                        <SelectItem
                          key={material.id}
                          value={material.id}
                          className="h-12 py-3"
                        >
                          <div className="flex items-center gap-3 w-full">
                            <FileText className="w-4 h-4 text-primary shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate text-sm">
                                {material.title || "Untitled"}
                              </p>
                              {material.subject_name && (
                                <p className="text-xs text-muted-foreground truncate mt-0.5">
                                  {material.subject_name}
                                </p>
                              )}
                            </div>
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {selectedMaterial && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-50 border border-blue-200">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-blue-900 truncate">
                      {selectedMaterial.title || "Untitled"}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-blue-700">
                      {selectedMaterial.subject_name && (
                        <span>{selectedMaterial.subject_name}</span>
                      )}
                      {selectedMaterial.subject_name &&
                        selectedMaterial.file_type && <span>•</span>}
                      {selectedMaterial.file_type && (
                        <span>{selectedMaterial.file_type}</span>
                      )}
                      {selectedMaterial.file_type &&
                        selectedMaterial.file_size && <span>•</span>}
                      {selectedMaterial.file_size && (
                        <span>
                          {formatFileSize(selectedMaterial.file_size)}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedMaterialId("");
                      setSelectedMaterial(null);
                    }}
                  >
                    Remove
                  </Button>
                </div>
              )}

              {loading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-sm text-muted-foreground">
                      Generating questions...
                    </span>
                    <span className="text-sm font-medium">
                      {uploadProgress}%
                    </span>
                  </div>
                  <Progress value={uploadProgress} />
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary"
                disabled={loading || !selectedMaterialId}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating Questions...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Questions
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Questions Section */}
      {qna.length > 0 && (
        <>
          {/* Stats Card */}
          <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1">
                      {isParent ? `Review Progress` : `Test Progress`}
                    </h3>
                    <div className="flex gap-6 text-sm">
                      <div>
                        <p className="text-blue-100">Total Questions</p>
                        <p className="text-2xl font-bold">{stats.total}</p>
                      </div>
                      {isParent ? (
                        <>
                          <div>
                            <p className="text-blue-100">Marked</p>
                            <p className="text-2xl font-bold">
                              {stats.marked}/{stats.total}
                            </p>
                          </div>
                          <div>
                            <p className="text-blue-100">Correct</p>
                            <p className="text-2xl font-bold">
                              {stats.correct}
                            </p>
                          </div>
                        </>
                      ) : (
                        <div>
                          <p className="text-blue-100">Answered</p>
                          <p className="text-2xl font-bold">
                            {stats.answered}/{stats.total}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  onClick={resetTest}
                  className="bg-white text-blue-600 hover:bg-blue-50"
                >
                  New Test
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Questions List */}
          <div className="space-y-4">
            {qna.map((q, index) => {
              // Use a unique key combining id and index to ensure uniqueness
              const uniqueKey = q.id || `q-${index}`;
              const isMarked = parentMarkings[uniqueKey] !== null;
              const isCorrect = parentMarkings[uniqueKey] === "right";
              const hasAnswer = studentAnswers[uniqueKey]?.trim() !== "";

              return (
                <Card
                  key={uniqueKey}
                  className={`shadow-lg border-0 transition-all hover:shadow-xl ${
                    isParent && isMarked
                      ? isCorrect
                        ? "bg-green-50 border-green-200"
                        : "bg-red-50 border-red-200"
                      : "bg-white"
                  }`}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      {/* Question Number Badge */}
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-lg shadow-md">
                          {index + 1}
                        </div>
                      </div>

                      {/* Question Content */}
                      <div className="flex-1 space-y-4">
                        <div>
                          <p className="text-lg font-semibold text-gray-800 mb-1">
                            {q.question}
                          </p>
                          {isParent && (
                            <div className="mt-3 p-3 rounded-lg bg-gray-50 border border-green-200">
                              <p className="text-green-700 font-medium">
                                {q.answer}
                              </p>
                            </div>
                          )}
                        </div>

                        {isParent ? (
                          <div className="flex gap-3">
                            <Button
                              variant={
                                parentMarkings[uniqueKey] === "right"
                                  ? "default"
                                  : "outline"
                              }
                              className={`flex-1 gap-2 ${
                                parentMarkings[uniqueKey] === "right"
                                  ? "bg-green-600 hover:bg-green-700 text-white border-green-600"
                                  : "hover:bg-green-50 hover:border-green-300"
                              }`}
                              onClick={() => {
                                setParentMarkings((prev) => ({
                                  ...prev,
                                  [uniqueKey]: "right",
                                }));
                              }}
                            >
                              {parentMarkings[uniqueKey] === "right" ? (
                                <CheckCircle2 className="w-4 h-4" />
                              ) : null}
                              Correct
                            </Button>
                            <Button
                              variant={
                                parentMarkings[uniqueKey] === "wrong"
                                  ? "destructive"
                                  : "outline"
                              }
                              className={`flex-1 gap-2 ${
                                parentMarkings[uniqueKey] === "wrong"
                                  ? "bg-red-600 hover:bg-red-700"
                                  : "hover:bg-red-50 hover:border-red-300"
                              }`}
                              onClick={() => {
                                setParentMarkings((prev) => ({
                                  ...prev,
                                  [uniqueKey]: "wrong",
                                }));
                              }}
                            >
                              {parentMarkings[uniqueKey] === "wrong" ? (
                                <XCircle className="w-4 h-4" />
                              ) : null}
                              Incorrect
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Textarea
                              placeholder="Type your answer here..."
                              className="min-h-[120px] text-base"
                              value={studentAnswers[uniqueKey] || ""}
                              onChange={(e) =>
                                setStudentAnswers((prev) => ({
                                  ...prev,
                                  [uniqueKey]: e.target.value,
                                }))
                              }
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Completion Message */}
          {isParent && stats.marked === stats.total && stats.total > 0 && (
            <Card className="shadow-lg border-0 bg-gradient-to-br from-emerald-500 to-green-500 text-white">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">
                      Review Complete! 🎉
                    </h3>
                    <p className="text-green-100">
                      You've reviewed all {stats.total} questions. Your child
                      got {stats.correct} correct answers.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
