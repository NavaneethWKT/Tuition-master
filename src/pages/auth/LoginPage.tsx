import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
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
import { GraduationCap, Loader2, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import apiClient from "../../services/apiClient";

// Validation schema
const loginSchema = z.object({
  contact: z
    .string()
    .min(1, "Contact number is required")
    .min(10, "Contact number must be at least 10 digits"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters long"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginPage() {
  const navigate = useNavigate();
  const {
    setUserRole,
    setUserData,
    setAccessToken,
    userRole,
    isAuthenticated,
  } = useAuth();
  const [activeRole, setActiveRole] = useState("student");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if already logged in
  React.useEffect(() => {
    if (isAuthenticated && userRole) {
      if (userRole === "student") {
        navigate("/student/dashboard", { replace: true });
      } else if (userRole === "parent") {
        navigate("/parent/dashboard", { replace: true });
      } else if (userRole === "teacher") {
        navigate("/teacher/dashboard", { replace: true });
      } else if (userRole === "school") {
        navigate("/admin/dashboard", { replace: true });
      }
    }
  }, [isAuthenticated, userRole, navigate]);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      contact: "",
      password: "",
    },
  });

  const handleLogin = async (values: LoginFormValues) => {
    setLoading(true);
    setError(null);

    try {
      const role = activeRole as "student" | "parent" | "teacher" | "school";

      const response = await apiClient.login(role, {
        phone: values.contact,
        password: values.password,
      });

      // Store access token (even if null, store it for consistency)
      setAccessToken(response.access_token || null);

      // Store user data from response
      const userData = {
        id: response.id,
        name: response.name,
        persona: response.persona,
        contact_email: response.contact_email,
        contact_phone: response.contact_phone,
        city: response.city,
        state: response.state,
        board_affiliation: response.board_affiliation,
        created_at: response.created_at,
      };
      setUserData(userData);

      // Set user role from response persona
      setUserRole(response.persona);

      // Navigate to appropriate dashboard based on persona from response
      // Use response.persona instead of userRole since state update is async
      const persona = response.persona;
      if (persona === "student") {
        navigate("/student/dashboard");
      } else if (persona === "parent") {
        navigate("/parent/dashboard");
      } else if (persona === "teacher") {
        navigate("/teacher/dashboard");
      } else if (persona === "school") {
        navigate("/admin/dashboard");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError("Login failed. Please check your credentials and try again.");
    } finally {
      setLoading(false);
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
                <TabsTrigger value="school" className="text-sm font-medium">
                  School Admin
                </TabsTrigger>
              </TabsList>

              <TabsContent value={activeRole} className="space-y-6 mt-2">
                {error && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(handleLogin)}
                    className="space-y-6"
                  >
                    <FormField
                      control={form.control}
                      name="contact"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact</FormLabel>
                          <FormControl>
                            <Input
                              type="tel"
                              placeholder="Enter your Contact Number"
                              className="h-12 text-lg"
                              disabled={loading}
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                setError(null);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter Password"
                                className="h-12 text-lg pr-12"
                                disabled={loading}
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e);
                                  setError(null);
                                }}
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none disabled:opacity-50"
                                disabled={loading}
                                aria-label={
                                  showPassword
                                    ? "Hide password"
                                    : "Show password"
                                }
                              >
                                {showPassword ? (
                                  <Eye className="w-5 h-5" />
                                ) : (
                                  <EyeOff className="w-5 h-5" />
                                )}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-3 pt-2">
                      <Button
                        type="submit"
                        className="flex-1 h-12 text-lg"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Logging in...
                          </>
                        ) : (
                          "Login"
                        )}
                      </Button>

                      {activeRole === "school" && (
                        <Button
                          type="button"
                          variant="outline"
                          className="flex-1 h-12"
                          onClick={() => navigate("/school-onboarding")}
                          disabled={loading}
                        >
                          Register School
                        </Button>
                      )}
                    </div>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
