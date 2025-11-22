import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import apiClient from "../services/apiClient";
import { Loader2 } from "lucide-react";

interface AddStudentDialogProps {
  classId: string;
  schoolId: string;
  onAddStudent: () => void;
}

export function AddStudentDialog({
  classId,
  schoolId,
  onAddStudent,
}: AddStudentDialogProps) {
  const [formData, setFormData] = useState({
    // Student Information
    studentName: "",
    studentEmail: "",
    studentPhone: "",
    studentPassword: "",
    studentConfirmPassword: "",
    dateOfBirth: "",
    rollNumber: "",
    admissionDate: "",
    // Parent Information
    parentName: "",
    parentEmail: "",
    parentPhone: "",
    parentPassword: "",
    parentConfirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate passwords match
    if (formData.studentPassword !== formData.studentConfirmPassword) {
      setError("Student passwords do not match");
      return;
    }

    if (formData.parentPassword !== formData.parentConfirmPassword) {
      setError("Parent passwords do not match");
      return;
    }

    if (!classId || !schoolId) {
      setError(
        "Class ID or School ID not found. Please refresh and try again."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // Step 1: Create student
      const studentRequestBody = {
        school_id: schoolId,
        class_id: classId,
        full_name: formData.studentName,
        email: formData.studentEmail,
        phone: formData.studentPhone,
        password: formData.studentPassword,
        date_of_birth: formData.dateOfBirth,
        roll_number: formData.rollNumber || "",
        admission_date:
          formData.admissionDate || new Date().toISOString().split("T")[0],
      };

      const studentResponse = await apiClient.createStudent(studentRequestBody);

      if (!studentResponse?.id) {
        throw new Error("Failed to create student. Student ID not received.");
      }

      const studentId = studentResponse.id;

      // Step 2: Create parent with student_id
      const parentRequestBody = {
        student_id: studentId,
        full_name: formData.parentName,
        email: formData.parentEmail,
        phone: formData.parentPhone,
        password: formData.parentPassword,
      };

      await apiClient.createParent(parentRequestBody);

      // Reset form and close dialog
      setFormData({
        studentName: "",
        studentEmail: "",
        studentPhone: "",
        studentPassword: "",
        studentConfirmPassword: "",
        dateOfBirth: "",
        rollNumber: "",
        admissionDate: "",
        parentName: "",
        parentEmail: "",
        parentPhone: "",
        parentPassword: "",
        parentConfirmPassword: "",
      });

      setOpen(false);

      // Refresh students list
      onAddStudent();

      alert("Student and parent created successfully!");
    } catch (err: any) {
      console.error("Error creating student/parent:", err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to create student/parent. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">Add Student</Button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Add Student to Class
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Student Information */}
          <div className="space-y-4">
            <h3 className="text-gray-800 font-medium">Student Information</h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Student Full Name *</Label>
                <Input
                  placeholder="Enter student name"
                  value={formData.studentName}
                  onChange={(e) => handleChange("studentName", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Date of Birth *</Label>
                <Input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Student Email *</Label>
                <Input
                  type="email"
                  placeholder="student@example.com"
                  value={formData.studentEmail}
                  onChange={(e) => handleChange("studentEmail", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Student Phone *</Label>
                <Input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={formData.studentPhone}
                  onChange={(e) => handleChange("studentPhone", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Roll Number</Label>
                <Input
                  placeholder="Enter roll number"
                  value={formData.rollNumber}
                  onChange={(e) => handleChange("rollNumber", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Admission Date</Label>
                <Input
                  type="date"
                  value={formData.admissionDate}
                  onChange={(e) =>
                    handleChange("admissionDate", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Student Password *</Label>
                <Input
                  type="password"
                  placeholder="Create password"
                  value={formData.studentPassword}
                  onChange={(e) =>
                    handleChange("studentPassword", e.target.value)
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Confirm Student Password *</Label>
                <Input
                  type="password"
                  placeholder="Re-enter password"
                  value={formData.studentConfirmPassword}
                  onChange={(e) =>
                    handleChange("studentConfirmPassword", e.target.value)
                  }
                  required
                />
              </div>
            </div>
            {formData.studentPassword &&
              formData.studentConfirmPassword &&
              formData.studentPassword !== formData.studentConfirmPassword && (
                <p className="text-sm text-red-600">
                  Student passwords do not match
                </p>
              )}
          </div>

          {/* Parent / Guardian Info */}
          <div className="space-y-4">
            <h3 className="text-gray-800 font-medium">
              Parent / Guardian Information
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Parent Name *</Label>
                <Input
                  placeholder="Enter parent name"
                  value={formData.parentName}
                  onChange={(e) => handleChange("parentName", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Parent Phone *</Label>
                <Input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={formData.parentPhone}
                  onChange={(e) => handleChange("parentPhone", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Parent Email *</Label>
                <Input
                  type="email"
                  placeholder="parent@example.com"
                  value={formData.parentEmail}
                  onChange={(e) => handleChange("parentEmail", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Parent Password *</Label>
                <Input
                  type="password"
                  placeholder="Create password"
                  value={formData.parentPassword}
                  onChange={(e) =>
                    handleChange("parentPassword", e.target.value)
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Confirm Parent Password *</Label>
                <Input
                  type="password"
                  placeholder="Re-enter password"
                  value={formData.parentConfirmPassword}
                  onChange={(e) =>
                    handleChange("parentConfirmPassword", e.target.value)
                  }
                  required
                />
              </div>
            </div>
            {formData.parentPassword &&
              formData.parentConfirmPassword &&
              formData.parentPassword !== formData.parentConfirmPassword && (
                <p className="text-sm text-red-600">
                  Parent passwords do not match
                </p>
              )}
          </div>

          {/* Footer Buttons */}
          <DialogFooter className="pt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isSubmitting}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Add Student"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
