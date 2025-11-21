import { React, useState } from "react";
import { LoginPage } from "./components/LoginPage";
import { RegisterPage } from "./components/RegisterPage";
import { StudentDashboard } from "./components/StudentDashboard";
import { AITutorChat } from "./components/AITutorChat";
import { MockTest } from "./components/MockTest";
import { UploadAnswer } from "./components/UploadAnswer";
import { Revision } from "./components/Revision";
import { ClassNotes } from "./components/ClassNotes";
import { ParentDashboard } from "./components/ParentDashboard";
import { TeacherDashboard } from "./components/TeacherDashboard";
import { SchoolAdminDashboard } from "./components/SchoolAdminDashboard";

type UserRole = "student" | "parent" | "teacher" | "admin" | null;
type Page =
  | "login"
  | "register"
  | "dashboard"
  | "ai-chat"
  | "mock-test"
  | "upload-answer"
  | "revision"
  | "class-notes"
  | "analytics";

export default function App() {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [currentPage, setCurrentPage] = useState<Page>("login");
  const [selectedPdfUrl, setSelectedPdfUrl] = useState<string | undefined>();
  const [selectedPdfTitle, setSelectedPdfTitle] = useState<
    string | undefined
  >();

  const handleLogin = (role: string) => {
    if (role === "register") {
      setCurrentPage("register");
    } else {
      setUserRole(role as UserRole);
      setCurrentPage("dashboard");
    }
  };

  const handleRegister = () => {
    // After successful registration, log them in as student
    setUserRole("student");
    setCurrentPage("dashboard");
  };

  const handleLogout = () => {
    setUserRole(null);
    setCurrentPage("login");
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
  };

  const handleNavigateToAIWithPdf = (pdfUrl: string, pdfTitle: string) => {
    setSelectedPdfUrl(pdfUrl);
    setSelectedPdfTitle(pdfTitle);
    setCurrentPage("ai-chat");
  };

  const handleBack = () => {
    setCurrentPage("dashboard");
  };

  const handleBackToLogin = () => {
    setCurrentPage("login");
  };

  // Register Page
  if (currentPage === "register") {
    return (
      <RegisterPage onRegister={handleRegister} onBack={handleBackToLogin} />
    );
  }

  // Login Page
  if (currentPage === "login" || !userRole) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Student/Parent Pages
  if (userRole === "student") {
    if (currentPage === "dashboard") {
      return (
        <StudentDashboard onNavigate={handleNavigate} onLogout={handleLogout} />
      );
    }
    if (currentPage === "ai-chat") {
      return (
        <AITutorChat
          onBack={handleBack}
          pdfUrl={selectedPdfUrl}
          pdfTitle={selectedPdfTitle}
        />
      );
    }
    if (currentPage === "mock-test") {
      return <MockTest onBack={handleBack} />;
    }
    if (currentPage === "upload-answer") {
      return <UploadAnswer onBack={handleBack} />;
    }
    if (currentPage === "revision") {
      return <Revision onBack={handleBack} />;
    }
    if (currentPage === "class-notes") {
      return (
        <ClassNotes
          onBack={handleBack}
          onNavigateToAI={handleNavigateToAIWithPdf}
        />
      );
    }
    if (currentPage === "analytics") {
      return (
        <StudentDashboard onNavigate={handleNavigate} onLogout={handleLogout} />
      );
    }
  }

  // Parent Pages
  if (userRole === "parent") {
    if (currentPage === "dashboard") {
      return (
        <ParentDashboard onNavigate={handleNavigate} onLogout={handleLogout} />
      );
    }
    if (currentPage === "mock-test") {
      return <MockTest onBack={handleBack} isParentView={true} />;
    }
    if (currentPage === "analytics") {
      return (
        <ParentDashboard onNavigate={handleNavigate} onLogout={handleLogout} />
      );
    }
  }

  // Teacher Pages
  if (userRole === "teacher") {
    return <TeacherDashboard onLogout={handleLogout} />;
  }

  // School Admin Pages
  if (userRole === "admin") {
    return <SchoolAdminDashboard onLogout={handleLogout} />;
  }

  // Fallback
  return <LoginPage onLogin={handleLogin} />;
}
