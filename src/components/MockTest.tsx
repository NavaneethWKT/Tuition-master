import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import { ArrowLeft, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { Progress } from "./ui/progress";
import { Alert, AlertDescription } from "./ui/alert";
import { useAuth } from "../contexts/AuthContext";

interface MockTestProps {
  isParentView?: boolean;
}

export function MockTest({ isParentView = false }: MockTestProps) {
  const navigate = useNavigate();
  const { userRole } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeRemaining, setTimeRemaining] = useState(1800); // 30 minutes in seconds
  const [parentReviews, setParentReviews] = useState<Record<number, boolean>>(
    {}
  );
  const [showSubmitWarning, setShowSubmitWarning] = useState(false);

  const questions = [
    {
      id: 0,
      type: "mcq",
      question: "What is the value of x in the equation 2x + 5 = 15?",
      options: ["x = 3", "x = 5", "x = 7", "x = 10"],
      correctAnswer: "x = 5",
      studentAnswer: "x = 5",
    },
    {
      id: 1,
      type: "mcq",
      question: "Which of the following is a quadratic equation?",
      options: ["2x + 3 = 0", "x² + 5x + 6 = 0", "3x = 9", "x/2 = 4"],
      correctAnswer: "x² + 5x + 6 = 0",
      studentAnswer: "2x + 3 = 0",
    },
    {
      id: 2,
      type: "short",
      question: "Solve for y: 3y - 7 = 14",
      studentAnswer: "y = 7",
    },
    {
      id: 3,
      type: "long",
      question:
        "Explain the difference between a linear equation and a quadratic equation. Provide examples for each.",
      studentAnswer:
        "A linear equation has degree 1, while a quadratic equation has degree 2. Example: 2x + 3 = 0 is linear, x² + 5x + 6 = 0 is quadratic.",
    },
  ];

  // For parent view, populate answers with student answers
  if (isParentView && Object.keys(answers).length === 0) {
    const initialAnswers: Record<number, string> = {};
    questions.forEach((q) => {
      if (q.studentAnswer) {
        initialAnswers[q.id] = q.studentAnswer;
      }
    });
    setAnswers(initialAnswers);
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAnswerChange = (value: string) => {
    setAnswers({ ...answers, [currentQuestion]: value });
  };

  const handleParentReview = (questionId: number, checked: boolean) => {
    setParentReviews({ ...parentReviews, [questionId]: checked });
    setShowSubmitWarning(false);
  };

  const handleSubmit = () => {
    const unansweredQuestions = questions.filter((q) => !parentReviews[q.id]);

    if (isParentView && unansweredQuestions.length > 0) {
      setShowSubmitWarning(true);
      return;
    }

    // Submit logic here
    alert("Test submitted successfully!");
    const dashboardRoute =
      userRole === "student"
        ? "/student/dashboard"
        : userRole === "parent"
        ? "/parent/dashboard"
        : "/login";
    navigate(dashboardRoute);
  };

  const unansweredCount = questions.filter((q) => !parentReviews[q.id]).length;
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  const dashboardRoute =
                    userRole === "student"
                      ? "/student/dashboard"
                      : userRole === "parent"
                      ? "/parent/dashboard"
                      : "/login";
                  navigate(dashboardRoute);
                }}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h2 className="text-gray-800">
                  {isParentView ? "Mock Test Review" : "Mathematics Mock Test"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {isParentView
                    ? "Review your child's answers"
                    : `Question ${currentQuestion + 1} of ${questions.length}`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-orange-50 px-4 py-2 rounded-xl">
              <Clock className="w-5 h-5 text-orange-600" />
              <span className="font-semibold text-orange-600">
                {formatTime(timeRemaining)}
              </span>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 max-w-4xl">
        <Card className="shadow-lg border-0">
          <CardHeader>
            <div className="flex items-start justify-between">
              <CardTitle>
                Question {currentQuestion + 1}
                <span className="ml-3 text-sm font-normal text-muted-foreground">
                  (
                  {questions[currentQuestion].type === "mcq"
                    ? "Multiple Choice"
                    : questions[currentQuestion].type === "short"
                    ? "Short Answer"
                    : "Long Answer"}
                  )
                </span>
              </CardTitle>
              {answers[currentQuestion] && (
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {isParentView && (
              <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl border border-purple-200">
                <Checkbox
                  id={`review-${currentQuestion}`}
                  checked={parentReviews[currentQuestion] || false}
                  onCheckedChange={(checked) =>
                    handleParentReview(currentQuestion, checked as boolean)
                  }
                />
                <Label
                  htmlFor={`review-${currentQuestion}`}
                  className="text-sm font-medium text-purple-900 cursor-pointer"
                >
                  My child answered this question well
                </Label>
              </div>
            )}

            <div className="p-6 bg-blue-50 rounded-xl">
              <p className="text-lg text-gray-800">
                {questions[currentQuestion].question}
              </p>
            </div>

            {questions[currentQuestion].type === "mcq" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium">Options:</Label>
                  {isParentView && (
                    <span className="text-sm text-muted-foreground">
                      Student selected:{" "}
                      <span className="font-medium text-primary">
                        {questions[currentQuestion].studentAnswer}
                      </span>
                    </span>
                  )}
                </div>
                {isParentView ? (
                  <div className="space-y-3">
                    {questions[currentQuestion].options?.map(
                      (option, index) => (
                        <div
                          key={index}
                          className={`flex items-center space-x-3 p-4 rounded-xl border-2 ${
                            option === questions[currentQuestion].studentAnswer
                              ? "border-primary bg-primary/5"
                              : "border-border"
                          }`}
                        >
                          <RadioGroupItem
                            value={option}
                            id={`option-${index}`}
                            checked={
                              option ===
                              questions[currentQuestion].studentAnswer
                            }
                            disabled
                          />
                          <Label htmlFor={`option-${index}`} className="flex-1">
                            {option}
                          </Label>
                          {option ===
                            questions[currentQuestion].correctAnswer && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                              Correct
                            </span>
                          )}
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <RadioGroup
                    value={answers[currentQuestion]}
                    onValueChange={handleAnswerChange}
                  >
                    <div className="space-y-3">
                      {questions[currentQuestion].options?.map(
                        (option, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-3 p-4 rounded-xl border-2 border-border hover:border-primary transition-colors cursor-pointer"
                          >
                            <RadioGroupItem
                              value={option}
                              id={`option-${index}`}
                            />
                            <Label
                              htmlFor={`option-${index}`}
                              className="flex-1 cursor-pointer"
                            >
                              {option}
                            </Label>
                          </div>
                        )
                      )}
                    </div>
                  </RadioGroup>
                )}
              </div>
            )}

            {questions[currentQuestion].type === "short" && (
              <div className="space-y-3">
                <Label>
                  {isParentView ? "Student's Answer" : "Your Answer"}
                </Label>
                <Textarea
                  placeholder={
                    isParentView
                      ? "Student's answer will appear here..."
                      : "Enter your answer here..."
                  }
                  value={answers[currentQuestion] || ""}
                  onChange={(e) =>
                    !isParentView && handleAnswerChange(e.target.value)
                  }
                  className="min-h-[120px]"
                  disabled={isParentView}
                />
              </div>
            )}

            {questions[currentQuestion].type === "long" && (
              <div className="space-y-3">
                <Label>
                  {isParentView ? "Student's Answer" : "Your Answer"}
                </Label>
                <Textarea
                  placeholder={
                    isParentView
                      ? "Student's answer will appear here..."
                      : "Write your detailed answer here..."
                  }
                  value={answers[currentQuestion] || ""}
                  onChange={(e) =>
                    !isParentView && handleAnswerChange(e.target.value)
                  }
                  className="min-h-[300px]"
                  disabled={isParentView}
                />
              </div>
            )}

            {isParentView && showSubmitWarning && unansweredCount > 0 && (
              <Alert className="border-orange-200 bg-orange-50">
                <AlertCircle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800">
                  <strong>Please review all questions:</strong> You have not
                  marked {unansweredCount} question
                  {unansweredCount > 1 ? "s" : ""} as answered well. Questions
                  not reviewed:{" "}
                  {questions
                    .filter((q) => !parentReviews[q.id])
                    .map((q) => q.id + 1)
                    .join(", ")}
                </AlertDescription>
              </Alert>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() =>
                  setCurrentQuestion(Math.max(0, currentQuestion - 1))
                }
                disabled={currentQuestion === 0}
                className="flex-1"
              >
                Previous
              </Button>
              {currentQuestion < questions.length - 1 ? (
                <Button
                  onClick={() => setCurrentQuestion(currentQuestion + 1)}
                  className="flex-1"
                >
                  Next Question
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  {isParentView ? "Submit Review" : "Submit Test"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Question Navigator */}
        <Card className="mt-6 shadow-lg border-0">
          <CardHeader>
            <CardTitle>Question Navigator</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-8 gap-3">
              {questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestion(index)}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center font-medium transition-all relative ${
                    currentQuestion === index
                      ? "bg-primary text-white shadow-md"
                      : isParentView && parentReviews[index]
                      ? "bg-green-100 text-green-700 border-2 border-green-300"
                      : isParentView && !parentReviews[index] && answers[index]
                      ? "bg-orange-100 text-orange-700 border-2 border-orange-300"
                      : answers[index]
                      ? "bg-green-100 text-green-700 border-2 border-green-300"
                      : "bg-muted text-foreground hover:bg-muted/80"
                  }`}
                  title={
                    isParentView
                      ? parentReviews[index]
                        ? "Reviewed - Answered well"
                        : "Not reviewed"
                      : answers[index]
                      ? "Answered"
                      : "Not answered"
                  }
                >
                  {index + 1}
                  {isParentView && parentReviews[index] && (
                    <CheckCircle2 className="absolute -top-1 -right-1 w-4 h-4 text-green-600 bg-white rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sticky Submit Button */}
        {!isParentView && (
          <div className="fixed bottom-6 right-6">
            <Button
              size="lg"
              onClick={handleSubmit}
              className="shadow-2xl bg-green-600 hover:bg-green-700"
            >
              Submit Test
            </Button>
          </div>
        )}

        {/* Parent Review Summary */}
        {isParentView && (
          <Card className="mt-6 shadow-lg border-0">
            <CardHeader>
              <CardTitle>Review Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    Questions Reviewed:
                  </span>
                  <span className="font-medium">
                    {
                      Object.keys(parentReviews).filter(
                        (k) => parentReviews[Number(k)]
                      ).length
                    }{" "}
                    / {questions.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    Questions Not Reviewed:
                  </span>
                  <span className="font-medium text-orange-600">
                    {unansweredCount}
                  </span>
                </div>
                {unansweredCount > 0 && (
                  <div className="mt-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <p className="text-sm text-orange-800">
                      <strong>Note:</strong> Questions{" "}
                      {questions
                        .filter((q) => !parentReviews[q.id])
                        .map((q) => q.id + 1)
                        .join(", ")}{" "}
                      have not been marked as answered well.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
