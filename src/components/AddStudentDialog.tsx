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

export function AddStudentDialog({ onAddStudent }) {
  const [formData, setFormData] = useState({
    studentName: "",
    parentName: "",
    email: "",
    phone: "",
    grade: "",
    section: "",
    rollNumber: "",
    dateOfBirth: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = () => {
    onAddStudent(formData);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="gap-2">Add Student</Button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Add Student to Class
          </DialogTitle>
        </DialogHeader>

        {/* FORM CONTENT */}
        <div className="space-y-6">
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
                <Label>Grade/Class *</Label>
                <Select
                  value={formData.grade}
                  onValueChange={(value) => handleChange("grade", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {[...Array(12)].map((_, i) => (
                      <SelectItem key={i + 1} value={`${i + 1}`}>
                        Grade {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Section *</Label>
                <Select
                  value={formData.section}
                  onValueChange={(value) => handleChange("section", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select section" />
                  </SelectTrigger>
                  <SelectContent>
                    {["A", "B", "C", "D"].map((sec) => (
                      <SelectItem key={sec} value={sec}>
                        Section {sec}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Roll Number</Label>
                <Input
                  placeholder="Enter roll number"
                  value={formData.rollNumber}
                  onChange={(e) => handleChange("rollNumber", e.target.value)}
                />
              </div>
            </div>
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
                <Label>Phone Number *</Label>
                <Input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Email Address *</Label>
                <Input
                  type="email"
                  placeholder="parent@example.com"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-gray-800">Account Security</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
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
              <p className="text-sm text-red-600">Passwords do not match</p>
            )}
        </div>

        {/* Footer Buttons */}
        <DialogFooter className="pt-4">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button onClick={handleSubmit}>Add Student</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
