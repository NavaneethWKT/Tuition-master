import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Upload, FileText, Sparkles, CheckCircle2, Star } from "lucide-react";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Progress } from "../../components/ui/progress";
import { PageHeader } from "../../components/PageHeader";

export function Revision() {
  const navigate = useNavigate();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  // Mock saved revision topics
  const savedTopics = [
    {
      id: 1,
      title: "Introduction to Algebra",
      subject: "Mathematics",
      chapter: "Chapter 1",
      addedDate: "Nov 20, 2025",
    },
    {
      id: 2,
      title: "Linear Equations",
      subject: "Mathematics",
      chapter: "Chapter 2",
      addedDate: "Nov 18, 2025",
    },
    {
      id: 3,
      title: "Laws of Motion",
      subject: "Physics",
      chapter: "Chapter 3",
      addedDate: "Nov 15, 2025",
    },
  ];

  // Mock AI-generated summary
  const summaryPoints = [
    {
      title: "Key Concepts",
      points: [
        "Algebra uses letters and symbols to represent numbers and quantities",
        "Variables represent unknown or changing values (x, y, z)",
        "Constants are fixed values that don't change",
        "Expressions combine variables, constants, and operators",
      ],
    },
    {
      title: "Important Formulas",
      points: [
        "Linear equation: ax + b = c",
        "Solving for x: x = (c - b) / a",
        "Distributive property: a(b + c) = ab + ac",
        "Combining like terms: 3x + 2x = 5x",
      ],
    },
    {
      title: "Problem-Solving Steps",
      points: [
        "Identify the unknown variable",
        "Set up the equation based on given information",
        "Isolate the variable by performing inverse operations",
        "Check your solution by substituting back",
      ],
    },
    {
      title: "Common Mistakes to Avoid",
      points: [
        "Forgetting to apply operations to both sides of equation",
        "Mixing up addition and multiplication operations",
        "Not simplifying expressions completely",
        "Skipping the verification step",
      ],
    },
    {
      title: "Practice Tips",
      points: [
        "Start with simple equations and gradually increase difficulty",
        "Always show your work step by step",
        "Practice daily for 30 minutes to build confidence",
        "Use real-world examples to understand applications",
      ],
    },
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setUploadedFile(file);
    }
  };

  const handleProcessPDF = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowSummary(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Revision Center"
        subtitle="Review your saved topics and generate AI summaries"
        showBackButton={true}
        backRoute="/student/dashboard"
      />

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 max-w-6xl space-y-6">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Left Section - Saved Topics */}
          <div className="md:col-span-1 space-y-6">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle>Saved Topics</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-3">
                    {savedTopics.map((topic) => (
                      <button
                        key={topic.id}
                        className="w-full text-left p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors group"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="text-xs text-muted-foreground">
                              {topic.chapter}
                            </span>
                          </div>
                        </div>
                        <h4 className="font-medium mb-1 group-hover:text-primary transition-colors">
                          {topic.title}
                        </h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          {topic.subject}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {topic.addedDate}
                        </p>
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Right Section - Upload & Summary */}
          <div className="md:col-span-2 space-y-6">
            {/* Upload Section */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  AI-Powered Summary Generator
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Upload a PDF chapter or notes to get an AI-generated summary
                  with key points, formulas, and study tips.
                </p>

                {!uploadedFile ? (
                  <label
                    htmlFor="pdf-upload"
                    className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-border rounded-xl cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                        <Upload className="w-6 h-6 text-primary" />
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-gray-800">
                          Upload PDF Chapter
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Click to browse or drag and drop
                        </p>
                      </div>
                    </div>
                    <input
                      id="pdf-upload"
                      type="file"
                      className="hidden"
                      accept="application/pdf"
                      onChange={handleFileUpload}
                    />
                  </label>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-50 border border-blue-200">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-blue-900">
                          {uploadedFile.name}
                        </p>
                        <p className="text-sm text-blue-700">
                          {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setUploadedFile(null);
                          setShowSummary(false);
                        }}
                      >
                        Remove
                      </Button>
                    </div>

                    {!showSummary && (
                      <Button
                        onClick={handleProcessPDF}
                        disabled={isProcessing}
                        className="w-full gap-2"
                      >
                        {isProcessing ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Generating Summary...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4" />
                            Generate AI Summary
                          </>
                        )}
                      </Button>
                    )}

                    {isProcessing && (
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          AI is analyzing your document...
                        </p>
                        <Progress value={66} className="h-2" />
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Summary Display */}
            {showSummary && (
              <Card className="shadow-lg border-0 border-l-4 border-l-primary">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      AI-Generated Summary
                    </CardTitle>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Star className="w-4 h-4" />
                      Save to Revision
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px] pr-4">
                    <div className="space-y-6">
                      {summaryPoints.map((section, index) => (
                        <div key={index} className="space-y-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                              <span className="text-sm font-bold text-primary">
                                {index + 1}
                              </span>
                            </div>
                            <h3 className="text-gray-800">{section.title}</h3>
                          </div>
                          <ul className="space-y-2 ml-10">
                            {section.points.map((point, pointIndex) => (
                              <li
                                key={pointIndex}
                                className="flex items-start gap-3 text-gray-700"
                              >
                                <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0" />
                                <span>{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}

                      {/* Quick Actions */}
                      <div className="pt-6 border-t space-y-3">
                        <h4 className="font-medium text-gray-800">
                          Quick Actions
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                          <Button variant="outline" className="gap-2">
                            <FileText className="w-4 h-4" />
                            Export as PDF
                          </Button>
                          <Button variant="outline" className="gap-2">
                            <Sparkles className="w-4 h-4" />
                            Create Flashcards
                          </Button>
                          <Button variant="outline" className="gap-2">
                            <CheckCircle2 className="w-4 h-4" />
                            Generate Quiz
                          </Button>
                          <Button variant="outline" className="gap-2">
                            <Upload className="w-4 h-4" />
                            Share Summary
                          </Button>
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
