import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { GraduationCap } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export function LoginPage() {
  const navigate = useNavigate();
  const { setUserRole } = useAuth();
  const [activeRole, setActiveRole] = useState("student");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (phone && password) {
      const role = activeRole as "student" | "parent" | "teacher" | "admin";
      setUserRole(role);

      // Navigate to appropriate dashboard
      if (role === "student") {
        navigate("/student/dashboard");
      } else if (role === "parent") {
        navigate("/parent/dashboard");
      } else if (role === "teacher") {
        navigate("/teacher/dashboard");
      } else if (role === "admin") {
        navigate("/admin/dashboard");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-12 items-center">
        {/* Hero Section */}
        <div className="hidden md:flex flex-col justify-center space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-blue-600">Tuition Master</h1>
          </div>
          <h2 className="text-gray-800">AI-Powered Learning Platform</h2>
          <p className="text-gray-600">
            Experience personalized education with AI tutoring, automated
            assessments, and comprehensive learning management for students,
            parents, teachers, and administrators.
          </p>
          <img
            src="https://images.unsplash.com/photo-1760006782177-7f05cce886bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZHVjYXRpb24lMjBsZWFybmluZyUyMGlsbHVzdHJhdGlvbnxlbnwxfHx8fDE3NjM3MjIxNDR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Education illustration"
            className="w-full rounded-2xl shadow-lg"
          />
        </div>

        {/* Login Form */}
        <Card className="shadow-2xl border-0">
          <CardHeader className="space-y-3">
            <CardTitle>Welcome Back!</CardTitle>
            <CardDescription>
              Select your role and sign in to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              value={activeRole}
              onValueChange={setActiveRole}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="student">Student</TabsTrigger>
                <TabsTrigger value="parent">Parent</TabsTrigger>
                <TabsTrigger value="teacher">Teacher</TabsTrigger>
                <TabsTrigger value="admin">School Admin</TabsTrigger>
              </TabsList>

              <TabsContent value="student" className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="phone-student">Phone Number</Label>
                  <Input
                    id="phone-student"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-student">Password</Label>
                  <Input
                    id="password-student"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12"
                  />
                </div>
                <div className="flex gap-3">
                  <Button onClick={handleLogin} className="flex-1 h-12">
                    Login
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 h-12"
                    onClick={() => navigate("/register")}
                  >
                    Register
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="parent" className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="phone-parent">Phone Number</Label>
                  <Input
                    id="phone-parent"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-parent">Password</Label>
                  <Input
                    id="password-parent"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12"
                  />
                </div>
                <Button onClick={handleLogin} className="w-full h-12">
                  Login
                </Button>
              </TabsContent>

              <TabsContent value="teacher" className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="phone-teacher">Phone Number</Label>
                  <Input
                    id="phone-teacher"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-teacher">Password</Label>
                  <Input
                    id="password-teacher"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12"
                  />
                </div>
                <Button onClick={handleLogin} className="w-full h-12">
                  Login
                </Button>
              </TabsContent>

              <TabsContent value="admin" className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="phone-admin">Phone Number</Label>
                  <Input
                    id="phone-admin"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-admin">Password</Label>
                  <Input
                    id="password-admin"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12"
                  />
                </div>
                <div className="flex gap-3">
                  <Button onClick={handleLogin} className="flex-1 h-12">
                    Login
                  </Button>
                  {activeRole !== "teacher" && (
                    <Button
                      variant="outline"
                      className="flex-1 h-12"
                      onClick={() => navigate("/register")}
                    >
                      Register
                    </Button>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
