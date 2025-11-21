import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { PdfProvider } from "./contexts/PdfContext";
import { SchoolProvider } from "./contexts/SchoolContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { SchoolOnboarding } from "./pages/auth/SchoolOnboarding";
import { StudentDashboard } from "./pages/student/StudentDashboard";
import { ParentDashboard } from "./pages/parent/ParentDashboard";
import { TeacherDashboard } from "./pages/teacher/TeacherDashboard";
import { SchoolAdminDashboard } from "./pages/school-admin/SchoolAdminDashboard";
import { AITutorChat } from "./pages/student/AITutorChat";
import { ClassNotes } from "./pages/student/ClassNotes";
import { MockTest } from "./pages/student/MockTest";
import { Revision } from "./pages/student/Revision";
import { TeacherClass } from "./pages/teacher/TeacherClass";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PdfProvider>
          <SchoolProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/school-onboarding" element={<SchoolOnboarding />} />

              {/* Student Routes */}
              <Route
                path="/student/dashboard"
                element={
                  <ProtectedRoute allowedRoles={["student"]}>
                    <StudentDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/ai-chat"
                element={
                  <ProtectedRoute allowedRoles={["student"]}>
                    <AITutorChat />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/class-notes"
                element={
                  <ProtectedRoute allowedRoles={["student"]}>
                    <ClassNotes />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/mock-test"
                element={
                  <ProtectedRoute allowedRoles={["student"]}>
                    <MockTest />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/revision"
                element={
                  <ProtectedRoute allowedRoles={["student"]}>
                    <Revision />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/analytics"
                element={
                  <ProtectedRoute allowedRoles={["student"]}>
                    <StudentDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Parent Routes */}
              <Route
                path="/parent/dashboard"
                element={
                  <ProtectedRoute allowedRoles={["parent"]}>
                    <ParentDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/parent/mock-test"
                element={
                  <ProtectedRoute allowedRoles={["parent"]}>
                    <MockTest isParentView={true} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/parent/analytics"
                element={
                  <ProtectedRoute allowedRoles={["parent"]}>
                    <ParentDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Teacher Routes */}
              <Route
                path="/teacher/dashboard"
                element={
                  <ProtectedRoute allowedRoles={["teacher"]}>
                    <TeacherDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/teacher/class"
                element={
                  <ProtectedRoute allowedRoles={["teacher"]}>
                    <TeacherClass />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={["school"]}>
                    <SchoolAdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Default redirects */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </SchoolProvider>
        </PdfProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
