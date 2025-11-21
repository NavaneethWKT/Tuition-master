import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { GraduationCap, ArrowLeft, Building2 } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useSchool } from "../../contexts/SchoolContext";

export function SchoolOnboarding() {
  const navigate = useNavigate();
  const { setUserRole } = useAuth();
  const { setSchoolData } = useSchool();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // School Basic Information
    schoolName: "",
    establishmentYear: "",
    boardAffiliation: "",

    // Contact Information
    email: "",
    phone: "",

    // Address Information
    city: "",
    state: "",
    pincode: "",

    // Administrative Details
    principalName: "",
    principalEmail: "",
    principalPhone: "",
    adminName: "",
    adminEmail: "",
    adminPhone: "",

    // Account Security
    password: "",
    confirmPassword: "",
  });

  const handleChange = (field: string, value: string | string[]) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password === formData.confirmPassword) {
      // Save school data - only fields that exist in SchoolContext
      const schoolDataToSave = {
        schoolName: formData.schoolName,
        establishmentYear: formData.establishmentYear,
        boardAffiliation: formData.boardAffiliation,
        email: formData.email,
        phone: formData.phone,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        principalName: formData.principalName,
        principalEmail: formData.principalEmail,
        principalPhone: formData.principalPhone,
        adminName: formData.adminName,
        adminEmail: formData.adminEmail,
        adminPhone: formData.adminPhone,
      };
      setSchoolData(schoolDataToSave);
      // After successful registration, log them in as admin
      setUserRole("admin");
      navigate("/admin/dashboard");
    }
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="w-full max-w-5xl">
        <Card className="shadow-2xl border-0">
          <CardHeader className="space-y-3">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/login")}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle>School Onboarding</CardTitle>
                  <CardDescription>
                    Register your school to get started
                  </CardDescription>
                </div>
              </div>
            </div>

            {/* Progress Steps */}
            <div className="w-full mt-6">
              <div className="flex items-center w-full">
                {[1, 2, 3].map((step, index) => (
                  <React.Fragment key={step}>
                    <div className="flex flex-col items-center flex-1">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          currentStep >= step
                            ? "bg-primary text-white"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {step}
                      </div>
                      <span className="text-xs text-muted-foreground mt-2 text-center">
                        {step === 1
                          ? "Basic Info"
                          : step === 2
                          ? "Contact"
                          : "Account"}
                      </span>
                    </div>
                    {index < 2 && (
                      <div
                        className={`flex-1 h-1 mx-2 ${
                          currentStep > step ? "bg-primary" : "bg-gray-200"
                        }`}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-800">
                    School Basic Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="schoolName">School Name *</Label>
                      <Input
                        id="schoolName"
                        placeholder="Enter school name"
                        value={formData.schoolName}
                        onChange={(e) =>
                          handleChange("schoolName", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="establishmentYear">
                        Establishment Year *
                      </Label>
                      <Input
                        id="establishmentYear"
                        type="number"
                        placeholder="e.g., 1990"
                        value={formData.establishmentYear}
                        onChange={(e) =>
                          handleChange("establishmentYear", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="boardAffiliation">
                        Board Affiliation *
                      </Label>
                      <Select
                        value={formData.boardAffiliation}
                        onValueChange={(value) =>
                          handleChange("boardAffiliation", value)
                        }
                      >
                        <SelectTrigger id="boardAffiliation">
                          <SelectValue placeholder="Select board" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cbse">CBSE</SelectItem>
                          <SelectItem value="icse">ICSE</SelectItem>
                          <SelectItem value="state">State Board</SelectItem>
                          <SelectItem value="igcse">IGCSE</SelectItem>
                          <SelectItem value="ib">IB</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Contact & Address */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Contact & Address Information
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-md font-medium mb-4">
                        Contact Details
                      </h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address *</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="school@example.com"
                            value={formData.email}
                            onChange={(e) =>
                              handleChange("email", e.target.value)
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number *</Label>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="+91 98765 43210"
                            value={formData.phone}
                            onChange={(e) =>
                              handleChange("phone", e.target.value)
                            }
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-md font-medium mb-4">Address</h4>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="city">City *</Label>
                          <Input
                            id="city"
                            placeholder="Enter city"
                            value={formData.city}
                            onChange={(e) =>
                              handleChange("city", e.target.value)
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="state">State *</Label>
                          <Input
                            id="state"
                            placeholder="Enter state"
                            value={formData.state}
                            onChange={(e) =>
                              handleChange("state", e.target.value)
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="pincode">Pincode *</Label>
                          <Input
                            id="pincode"
                            type="number"
                            placeholder="Enter pincode"
                            value={formData.pincode}
                            onChange={(e) =>
                              handleChange("pincode", e.target.value)
                            }
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-md font-medium mb-4">
                        Administrative Contacts
                      </h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="principalName">
                            Principal Name *
                          </Label>
                          <Input
                            id="principalName"
                            placeholder="Principal full name"
                            value={formData.principalName}
                            onChange={(e) =>
                              handleChange("principalName", e.target.value)
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="principalEmail">
                            Principal Email
                          </Label>
                          <Input
                            id="principalEmail"
                            type="email"
                            placeholder="principal@school.com"
                            value={formData.principalEmail}
                            onChange={(e) =>
                              handleChange("principalEmail", e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="principalPhone">
                            Principal Phone
                          </Label>
                          <Input
                            id="principalPhone"
                            type="tel"
                            placeholder="+91 98765 43210"
                            value={formData.principalPhone}
                            onChange={(e) =>
                              handleChange("principalPhone", e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="adminName">Admin Name *</Label>
                          <Input
                            id="adminName"
                            placeholder="Admin full name"
                            value={formData.adminName}
                            onChange={(e) =>
                              handleChange("adminName", e.target.value)
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="adminEmail">Admin Email *</Label>
                          <Input
                            id="adminEmail"
                            type="email"
                            placeholder="admin@school.com"
                            value={formData.adminEmail}
                            onChange={(e) =>
                              handleChange("adminEmail", e.target.value)
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="adminPhone">Admin Phone *</Label>
                          <Input
                            id="adminPhone"
                            type="tel"
                            placeholder="+91 98765 43210"
                            value={formData.adminPhone}
                            onChange={(e) =>
                              handleChange("adminPhone", e.target.value)
                            }
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Account Security */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Account Security
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password">Password *</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Create a strong password"
                        value={formData.password}
                        onChange={(e) =>
                          handleChange("password", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">
                        Confirm Password *
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Re-enter password"
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          handleChange("confirmPassword", e.target.value)
                        }
                        required
                      />
                    </div>
                  </div>
                  {formData.password &&
                    formData.confirmPassword &&
                    formData.password !== formData.confirmPassword && (
                      <p className="text-sm text-red-600">
                        Passwords do not match
                      </p>
                    )}
                  <div className="flex items-start gap-2 pt-4 border-t">
                    <input
                      type="checkbox"
                      id="terms"
                      className="mt-1"
                      required
                    />
                    <label
                      htmlFor="terms"
                      className="text-sm text-muted-foreground"
                    >
                      I agree to the Terms & Conditions and Privacy Policy of
                      Tuition Master
                    </label>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                >
                  Previous
                </Button>
                {currentStep < 3 ? (
                  <Button type="button" onClick={nextStep}>
                    Next
                  </Button>
                ) : (
                  <Button type="submit" className="whitespace-normal min-w-32">
                    Complete Registration
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
