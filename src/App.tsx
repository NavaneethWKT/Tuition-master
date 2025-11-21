import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { PdfProvider } from "./contexts/PdfContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { LoginPage } from "./components/LoginPage";
import { RegisterPage } from "./components/RegisterPage";
import { StudentDashboard } from "./components/StudentDashboard";
import { ParentDashboard } from "./components/ParentDashboard";
import { TeacherDashboard } from "./components/TeacherDashboard";
import { SchoolAdminDashboard } from "./components/SchoolAdminDashboard";
import { AITutorChat } from "./components/AITutorChat";
import { ClassNotes } from "./components/ClassNotes";
import { MockTest } from "./components/MockTest";
import { Revision } from "./components/Revision";
import { UploadAnswer } from "./components/UploadAnswer";

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
              path="/student/upload-answer"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <UploadAnswer />
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
