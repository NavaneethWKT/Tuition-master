import React, { useState, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Progress } from "./ui/progress";
import {
  Upload,
  FileText,
  CheckCircle2,
  XCircle,
  Sparkles,
  Loader2,
  FileCheck,
  Award,
  Clock,
} from "lucide-react";

interface QnA {
  question: string;
  answer: string;
  id: string;
}

interface Props {
  role: "parent" | "student";
}

export default function PdfQnAUploader({ role }: Props) {
  const [qna, setQna] = useState<QnA[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [studentAnswers, setStudentAnswers] = useState<{
    [qId: string]: string;
  }>({});
  const [parentMarkings, setParentMarkings] = useState<{
    [qId: string]: "right" | "wrong" | null;
  }>({});

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === "application/pdf") {
      setFile(droppedFile);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    }
  };

  const uploadPdf = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 10;
      });
    }, 200);

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      const response = await fetch("/api/pdf-qna", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setUploadProgress(100);
        setTimeout(() => {
          setQna(data.qna || []);
          setLoading(false);
          setUploadProgress(0);
        }, 500);
      } else {
        alert("Upload failed. Please try again.");
        setLoading(false);
        setUploadProgress(0);
      }
    } catch (error) {
      alert("An error occurred. Please try again.");
      setLoading(false);
      setUploadProgress(0);
    }
    clearInterval(progressInterval);
  };

  const resetTest = () => {
    setQna([]);
    setFile(null);
    setStudentAnswers({});
    setParentMarkings({});
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getStats = () => {
    if (role === "parent") {
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
      {/* Upload Section */}
      {qna.length === 0 && (
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              Upload PDF to Generate Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={uploadPdf} className="space-y-6">
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-8 transition-all ${
                  isDragging
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div
                    className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-transform ${
                      isDragging ? "scale-110" : ""
                    } ${
                      file
                        ? "bg-green-100"
                        : "bg-gradient-to-br from-purple-100 to-blue-100"
                    }`}
                  >
                    {file ? (
                      <FileCheck className="w-10 h-10 text-green-600" />
                    ) : (
                      <Upload className="w-10 h-10 text-primary" />
                    )}
                  </div>
                  <div className="text-center">
                    {file ? (
                      <>
                        <p className="font-semibold text-gray-800 mb-1">
                          {file.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="font-medium text-gray-800 mb-1">
                          Drag and drop your PDF here
                        </p>
                        <p className="text-sm text-muted-foreground">
                          or click to browse files
                        </p>
                      </>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="pdf-upload"
                  />
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {file ? "Change File" : "Browse Files"}
                    </Button>
                    {file && (
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => {
                          setFile(null);
                          if (fileInputRef.current) {
                            fileInputRef.current.value = "";
                          }
                        }}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {loading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-sm text-muted-foreground">
                      Processing PDF...
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
                className="w-full h-12 text-base font-semibold bg-primary hover:from-purple-600 hover:to-blue-600"
                disabled={loading || !file}
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
                      {role === "parent" ? `Review Progress` : `Test Progress`}
                    </h3>
                    <div className="flex gap-6 text-sm">
                      <div>
                        <p className="text-blue-100">Total Questions</p>
                        <p className="text-2xl font-bold">{stats.total}</p>
                      </div>
                      {role === "parent" ? (
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
              const isMarked = parentMarkings[q.id] !== null;
              const isCorrect = parentMarkings[q.id] === "right";
              const hasAnswer = studentAnswers[q.id]?.trim() !== "";

              return (
                <Card
                  key={q.id}
                  className={`shadow-lg border-0 transition-all hover:shadow-xl ${
                    role === "parent" && isMarked
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
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                          {index + 1}
                        </div>
                      </div>

                      {/* Question Content */}
                      <div className="flex-1 space-y-4">
                        <div>
                          <p className="text-lg font-semibold text-gray-800 mb-1">
                            {q.question}
                          </p>
                          {role === "parent" && (
                            <div className="mt-3 p-3 rounded-lg bg-green-50 border border-green-200">
                              <div className="flex items-center gap-2 mb-1">
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                                <span className="text-sm font-semibold text-green-800">
                                  Correct Answer:
                                </span>
                              </div>
                              <p className="text-green-700 font-medium">
                                {q.answer}
                              </p>
                            </div>
                          )}
                        </div>

                        {role === "parent" ? (
                          <div className="flex gap-3">
                            <Button
                              variant={
                                parentMarkings[q.id] === "right"
                                  ? "default"
                                  : "outline"
                              }
                              className={`flex-1 gap-2 ${
                                parentMarkings[q.id] === "right"
                                  ? "bg-green-600 hover:bg-green-700 text-white border-green-600"
                                  : "hover:bg-green-50 hover:border-green-300"
                              }`}
                              onClick={() =>
                                setParentMarkings((m) => ({
                                  ...m,
                                  [q.id]: "right",
                                }))
                              }
                            >
                              {parentMarkings[q.id] === "right" ? (
                                <CheckCircle2 className="w-4 h-4" />
                              ) : null}
                              Correct
                            </Button>
                            <Button
                              variant={
                                parentMarkings[q.id] === "wrong"
                                  ? "destructive"
                                  : "outline"
                              }
                              className={`flex-1 gap-2 ${
                                parentMarkings[q.id] === "wrong"
                                  ? "bg-red-600 hover:bg-red-700"
                                  : "hover:bg-red-50 hover:border-red-300"
                              }`}
                              onClick={() =>
                                setParentMarkings((m) => ({
                                  ...m,
                                  [q.id]: "wrong",
                                }))
                              }
                            >
                              {parentMarkings[q.id] === "wrong" ? (
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
                              value={studentAnswers[q.id] || ""}
                              onChange={(e) =>
                                setStudentAnswers((a) => ({
                                  ...a,
                                  [q.id]: e.target.value,
                                }))
                              }
                            />
                            {hasAnswer && (
                              <div className="flex items-center gap-2 text-sm text-green-600">
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Answer saved</span>
                              </div>
                            )}
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
          {role === "parent" &&
            stats.marked === stats.total &&
            stats.total > 0 && (
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
