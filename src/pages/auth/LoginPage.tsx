import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { GraduationCap } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
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
    <div className="min-h-screen w-full flex items-center justify-center bg-paper p-4 relative overflow-hidden">
      <div className="relative z-10 w-full max-w-7xl grid md:grid-cols-2 gap-12 items-center">
        {/* Hero Section */}
        <div className="hidden md:flex flex-col justify-center space-y-6 pr-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-blue-700">Tuition Master</h1>
          </div>

          <h2 className="text-5xl font-extrabold text-gray-800 leading-tight">
            Smarter Learning
            <br /> Starts Today
          </h2>

          <p className="text-gray-600 text-lg">
            AI-driven learning, real-time academic tracking & seamless
            collaboration for students, parents, teachers and administrators —
            all in one place.
          </p>

          <img src="/assets/login-bg.png" className="w-full mt-4" />
        </div>

        {/* Login Form */}
        <Card className="shadow-2xl border-0 rounded-3xl bg-white/70 backdrop-blur-xl">
          <CardHeader className="space-y-3">
            <CardTitle className="text-3xl font-bold">Welcome Back!</CardTitle>
            <CardDescription className="text-gray-600">
              Log in to access your personalized dashboard
            </CardDescription>
          </CardHeader>

          <CardContent className="px-8 pb-10">
            <Tabs
              value={activeRole}
              onValueChange={setActiveRole}
              className="w-full"
            >
              <TabsList className="grid grid-cols-4 w-full mb-6 bg-gray-100 p-1 rounded-xl">
                <TabsTrigger value="student" className="text-sm font-medium">
                  Student
                </TabsTrigger>
                <TabsTrigger value="parent" className="text-sm font-medium">
                  Parent
                </TabsTrigger>
                <TabsTrigger value="teacher" className="text-sm font-medium">
                  Teacher
                </TabsTrigger>
                <TabsTrigger value="admin" className="text-sm font-medium">
                  School Admin
                </TabsTrigger>
              </TabsList>

              <TabsContent value={activeRole} className="space-y-6 mt-2">
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-12 text-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Password</Label>
                  <Input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 text-lg"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <Button onClick={handleLogin} className="flex-1 h-12 text-lg">
                    Login
                  </Button>

                  {activeRole === "admin" && (
                    <Button
                      variant="outline"
                      className="flex-1 h-12"
                      onClick={() => navigate("/school-onboarding")}
                    >
                      Register School
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
