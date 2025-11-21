import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  Upload as UploadIcon,
  Camera,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Progress } from "../components/ui/progress";
import { PageHeader } from "../components/PageHeader";

export function UploadAnswer() {
  const navigate = useNavigate();
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedFile(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEvaluate = () => {
    setIsEvaluating(true);
    setTimeout(() => {
      setIsEvaluating(false);
      setShowResults(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Upload Answer for Evaluation"
        subtitle="Get instant AI-powered feedback on your answers"
        showBackButton={true}
        backRoute="/student/dashboard"
      />

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 max-w-5xl space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Upload Section */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle>Upload Your Answer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {!uploadedFile ? (
                <div>
                  <label
                    htmlFor="file-upload"
                    className="flex flex-col items-center justify-center w-full h-80 border-2 border-dashed border-border rounded-xl cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 space-y-4">
                      <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                        <UploadIcon className="w-8 h-8 text-primary" />
                      </div>
                      <div className="text-center space-y-2">
                        <p className="font-medium text-gray-800">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Upload a photo of your handwritten answer
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PNG, JPG or PDF (MAX. 10MB)
                        </p>
                      </div>
                    </div>
                    <input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      accept="image/*,.pdf"
                      onChange={handleFileUpload}
                    />
                  </label>
                  <div className="flex gap-3 mt-4">
                    <Button variant="outline" className="flex-1 gap-2">
                      <Camera className="w-4 h-4" />
                      Take Photo
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative rounded-xl overflow-hidden border-2 border-border">
                    <img
                      src={uploadedFile}
                      alt="Uploaded answer"
                      className="w-full h-80 object-contain bg-gray-50"
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setUploadedFile(null)}
                      className="flex-1"
                    >
                      Remove
                    </Button>
                    <Button
                      onClick={handleEvaluate}
                      disabled={isEvaluating}
                      className="flex-1"
                    >
                      {isEvaluating ? "Evaluating..." : "Evaluate Answer"}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Evaluation Results */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle>AI Evaluation Results</CardTitle>
            </CardHeader>
            <CardContent>
              {!showResults && !isEvaluating && (
                <div className="h-80 flex items-center justify-center text-center">
                  <div className="space-y-3">
                    <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto">
                      <UploadIcon className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground">
                      Upload and evaluate your answer to see AI feedback
                    </p>
                  </div>
                </div>
              )}

              {isEvaluating && (
                <div className="h-80 flex items-center justify-center">
                  <div className="w-full max-w-xs space-y-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto animate-pulse">
                      <UploadIcon className="w-8 h-8 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-center font-medium">
                        Analyzing your answer...
                      </p>
                      <Progress value={66} className="h-2" />
                    </div>
                  </div>
                </div>
              )}

              {showResults && (
                <div className="space-y-6">
                  {/* Score */}
                  <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                    <p className="text-sm text-green-700 mb-2">Your Score</p>
                    <div className="text-5xl font-bold text-green-600 mb-2">
                      85/100
                    </div>
                    <p className="text-sm text-green-700">Excellent Work!</p>
                  </div>

                  {/* Strengths */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <h4 className="text-green-700">Strengths</h4>
                    </div>
                    <ul className="space-y-2 ml-7">
                      <li className="text-sm text-gray-700">
                        Clear step-by-step approach to solving the equation
                      </li>
                      <li className="text-sm text-gray-700">
                        Correct mathematical operations applied
                      </li>
                      <li className="text-sm text-gray-700">
                        Good handwriting and organization
                      </li>
                    </ul>
                  </div>

                  {/* Areas for Improvement */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-orange-600" />
                      <h4 className="text-orange-700">Areas for Improvement</h4>
                    </div>
                    <ul className="space-y-2 ml-7">
                      <li className="text-sm text-gray-700">
                        Add units to your final answer
                      </li>
                      <li className="text-sm text-gray-700">
                        Show work for simplification step
                      </li>
                    </ul>
                  </div>

                  {/* Suggestions */}
                  <div className="p-4 bg-blue-50 rounded-xl">
                    <h4 className="text-blue-700 mb-2">AI Suggestions</h4>
                    <p className="text-sm text-gray-700">
                      Great job on this problem! To improve further, make sure
                      to always include units in your final answer and show all
                      intermediate steps clearly. Keep up the excellent work!
                    </p>
                  </div>

                  <Button
                    className="w-full"
                    onClick={() => navigate("/student/dashboard")}
                  >
                    Back to Dashboard
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
