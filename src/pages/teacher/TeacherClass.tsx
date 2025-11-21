import { useParams, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/card";
import { AddStudentDialog } from "../../components/AddStudentDialog";
import { DashboardHeader } from "../../components/DashboardHeader";
import { BookOpen, ArrowLeft } from "lucide-react";

export function TeacherClass() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [students, setStudents] = useState([
    {
      name: "Ananya Gupta",
      dob: "24/06/13",
      contact: "1234567890",
      email: "abc@gmail.com",
      roll: 1,
    },
    {
      name: "Rohit Singh",
      dob: "24/06/13",
      contact: "1234567890",
      email: "abc@gmail.com",
      roll: 2,
    },
    {
      name: "Meera Nair",
      dob: "24/06/13",
      contact: "1234567890",
      email: "abc@gmail.com",
      roll: 3,
    },
  ]);

  const handleAddStudent = (student) => {
    setStudents((prev) => [...prev, student]);
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader
        title="Tuition Master"
        subtitle="Teacher Portal"
        icon={
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
        }
      />

      <div className="container mx-auto px-6 py-8 space-y-6">
        {/* Top Header with Back Button */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/teacher/dashboard")}
            className="rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-semibold">Class Details - {id}</h1>
        </div>

        <Card className="shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">
                Students in this Class
              </CardTitle>
              <AddStudentDialog onAddStudent={handleAddStudent} />
            </div>
          </CardHeader>

          <CardContent>
            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr className="text-left">
                    <th className="p-3 font-medium">Name</th>
                    <th className="p-3 font-medium">Date of Birth</th>
                    <th className="p-3 font-medium">Contact</th>
                    <th className="p-3 font-medium">Email</th>
                    <th className="p-3 font-medium">Roll No</th>
                  </tr>
                </thead>

                <tbody>
                  {students.map((student, index) => (
                    <tr
                      key={index}
                      className="border-t hover:bg-muted/30 transition-colors"
                    >
                      <td className="p-3">{student.name}</td>
                      <td className="p-3">{student.dob}</td>
                      <td className="p-3">{student.contact}</td>
                      <td className="p-3">{student.email}</td>
                      <td className="p-3 text-muted-foreground">
                        {student.roll}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
