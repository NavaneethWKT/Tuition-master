import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { PdfProvider } from "./contexts/PdfContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { StudentDashboard } from "./pages/student/StudentDashboard";
import { ParentDashboard } from "./pages/parent/ParentDashboard";
import { TeacherDashboard } from "./pages/teacher/TeacherDashboard";
import { SchoolAdminDashboard } from "./pages/school-admin/SchoolAdminDashboard";
import { AITutorChat } from "./pages/student/AITutorChat";
import { ClassNotes } from "./pages/student/ClassNotes";
import { MockTest } from "./pages/student/MockTest";
import { Revision } from "./pages/student/Revision";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PdfProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

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

            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <SchoolAdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Default redirects */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </PdfProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
