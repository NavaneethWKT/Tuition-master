import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "../../components/ui/dialog";
import {
  User,
  FileText,
  BarChart3,
  TrendingUp,
  FlaskConical,
  Loader2,
  StickyNote,
  Bell,
  Plus,
  Edit,
  Trash2,
  Calendar,
  Clock,
} from "lucide-react";
import { DashboardHeader } from "../../components/DashboardHeader";
import { ActionCard } from "../../components/ActionCard";
import { StatCard } from "../../components/StatCard";
import { useAuth } from "../../contexts/AuthContext";
import apiClient from "../../services/apiClient";

interface Note {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface Reminder {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  type: "meeting" | "test" | "event" | "other";
  completed: boolean;
  createdAt: string;
}

const STORAGE_KEYS = {
  NOTES: "parentNotes",
  REMINDERS: "parentReminders",
};

export function ParentDashboard() {
  const navigate = useNavigate();
  const { userData } = useAuth();

  const [studentData, setStudentData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Notes and Reminders state
  const [notes, setNotes] = useState<Note[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.NOTES);
    return stored ? JSON.parse(stored) : [];
  });

  const [reminders, setReminders] = useState<Reminder[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.REMINDERS);
    return stored ? JSON.parse(stored) : [];
  });

  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [reminderDialogOpen, setReminderDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);

  // Form states
  const [noteContent, setNoteContent] = useState("");
  const [reminderForm, setReminderForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    type: "other" as Reminder["type"],
  });

  useEffect(() => {
    if (userData?.id) {
      fetchStudentDetails();
    }
  }, [userData?.id]);

  // Save notes to localStorage whenever notes change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
  }, [notes]);

  // Save reminders to localStorage whenever reminders change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(reminders));
  }, [reminders]);

  const fetchStudentDetails = async () => {
    if (!userData?.id) return;
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.getParentStudent(userData.id);
      setStudentData(response);
    } catch (err: any) {
      console.error("Error fetching student details:", err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to fetch student details. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Notes functions
  const handleAddNote = () => {
    if (!noteContent.trim()) return;

    if (editingNote) {
      setNotes(
        notes.map((note) =>
          note.id === editingNote.id
            ? {
                ...note,
                content: noteContent,
                updatedAt: new Date().toISOString(),
              }
            : note
        )
      );
      setEditingNote(null);
    } else {
      const newNote: Note = {
        id: Date.now().toString(),
        content: noteContent,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setNotes([newNote, ...notes]);
    }
    setNoteContent("");
    setNoteDialogOpen(false);
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setNoteContent(note.content);
    setNoteDialogOpen(true);
  };

  const handleDeleteNote = (id: string) => {
    if (confirm("Are you sure you want to delete this note?")) {
      setNotes(notes.filter((note) => note.id !== id));
    }
  };

  // Reminders functions
  const handleAddReminder = () => {
    if (
      !reminderForm.title.trim() ||
      !reminderForm.date ||
      !reminderForm.time
    ) {
      alert("Please fill in all required fields");
      return;
    }

    if (editingReminder) {
      setReminders(
        reminders.map((reminder) =>
          reminder.id === editingReminder.id
            ? {
                ...reminder,
                ...reminderForm,
              }
            : reminder
        )
      );
      setEditingReminder(null);
    } else {
      const newReminder: Reminder = {
        id: Date.now().toString(),
        ...reminderForm,
        completed: false,
        createdAt: new Date().toISOString(),
      };
      setReminders([newReminder, ...reminders]);
    }
    setReminderForm({
      title: "",
      description: "",
      date: "",
      time: "",
      type: "other",
    });
    setReminderDialogOpen(false);
  };

  const handleEditReminder = (reminder: Reminder) => {
    setEditingReminder(reminder);
    setReminderForm({
      title: reminder.title,
      description: reminder.description,
      date: reminder.date,
      time: reminder.time,
      type: reminder.type,
    });
    setReminderDialogOpen(true);
  };

  const handleDeleteReminder = (id: string) => {
    if (confirm("Are you sure you want to delete this reminder?")) {
      setReminders(reminders.filter((reminder) => reminder.id !== id));
    }
  };

  const handleToggleReminder = (id: string) => {
    setReminders(
      reminders.map((reminder) =>
        reminder.id === id
          ? { ...reminder, completed: !reminder.completed }
          : reminder
      )
    );
  };

  // Get upcoming reminders (not completed, date >= today)
  const getUpcomingReminders = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return reminders
      .filter((reminder) => {
        if (reminder.completed) return false;
        const reminderDate = new Date(reminder.date);
        reminderDate.setHours(0, 0, 0, 0);
        return reminderDate >= today;
      })
      .sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return dateA.getTime() - dateB.getTime();
      })
      .slice(0, 3);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getReminderTypeColor = (type: Reminder["type"]) => {
    const colors = {
      meeting: "bg-blue-100 text-blue-700",
      test: "bg-red-100 text-red-700",
      event: "bg-green-100 text-green-700",
      other: "bg-gray-100 text-gray-700",
    };
    return colors[type];
  };

  const upcomingReminders = getUpcomingReminders();

  return (
    <div className="min-h-screen bg-paper">
      <DashboardHeader />

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* Greeting */}
        <div>
          <h1 className="text-gray-800 mb-2">Welcome, Parent 👋</h1>
          <p className="text-muted-foreground">
            Monitor your child's progress and performance
          </p>
        </div>

        {/* Student Info Card */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="pt-6">
            {error && (
              <div className="mb-4 p-3 bg-white/20 rounded-md border border-white/30">
                <p className="text-sm text-white">{error}</p>
              </div>
            )}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-white" />
                <span className="ml-2 text-white">
                  Loading student details...
                </span>
              </div>
            ) : studentData ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">
                      {studentData.full_name || "N/A"}
                    </h2>
                    <div className="flex gap-4 text-blue-100">
                      <span>Roll No: {studentData.roll_number || "N/A"}</span>
                      {studentData.email && (
                        <>
                          <span>•</span>
                          <span>{studentData.email}</span>
                        </>
                      )}
                    </div>
                    {studentData.phone && (
                      <p className="text-blue-100 mt-1">{studentData.phone}</p>
                    )}
                    {studentData.date_of_birth && (
                      <p className="text-blue-100 mt-1 text-sm">
                        Date of Birth:{" "}
                        {new Date(
                          studentData.date_of_birth
                        ).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-white">
                No student information available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div>
          <h2 className="mb-6 text-gray-800">Quick Actions</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Mock Test Review Card */}
            <Card
              className="shadow-lg border-0 hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => navigate("/parent/mock-test")}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Generate Mock Test</CardTitle>
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Review your child's mock test answers and provide feedback
                </p>
                <Button className="w-full">Generate</Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Notes & Reminders Section */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Notes Card */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                    <StickyNote className="w-5 h-5 text-yellow-600" />
                  </div>
                  <CardTitle>My Notes</CardTitle>
                </div>
                <Dialog open={noteDialogOpen} onOpenChange={setNoteDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      onClick={() => {
                        setEditingNote(null);
                        setNoteContent("");
                      }}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Note
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {editingNote ? "Edit Note" : "Add New Note"}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="note-content">Note</Label>
                        <Textarea
                          id="note-content"
                          placeholder="Write your note here..."
                          value={noteContent}
                          onChange={(e) => setNoteContent(e.target.value)}
                          rows={6}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setNoteDialogOpen(false);
                          setEditingNote(null);
                          setNoteContent("");
                        }}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleAddNote}>
                        {editingNote ? "Update" : "Save"} Note
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {notes.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <StickyNote className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No notes yet. Add your first note!</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {notes.map((note) => (
                    <div
                      key={note.id}
                      className="p-4 bg-yellow-50 rounded-lg border border-yellow-200 hover:shadow-md transition-shadow"
                    >
                      <p className="text-sm whitespace-pre-wrap mb-2">
                        {note.content}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                          {formatDate(note.createdAt)}
                          {note.updatedAt !== note.createdAt && " (edited)"}
                        </span>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2"
                            onClick={() => handleEditNote(note)}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteNote(note.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Reminders Card */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                    <Bell className="w-5 h-5 text-orange-600" />
                  </div>
                  <CardTitle>Reminders</CardTitle>
                </div>
                <Dialog
                  open={reminderDialogOpen}
                  onOpenChange={setReminderDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      onClick={() => {
                        setEditingReminder(null);
                        setReminderForm({
                          title: "",
                          description: "",
                          date: "",
                          time: "",
                          type: "other",
                        });
                      }}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Reminder
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {editingReminder ? "Edit Reminder" : "Add New Reminder"}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="reminder-title">Title *</Label>
                        <Input
                          id="reminder-title"
                          placeholder="e.g., Parent-Teacher Meeting"
                          value={reminderForm.title}
                          onChange={(e) =>
                            setReminderForm({
                              ...reminderForm,
                              title: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="reminder-description">
                          Description
                        </Label>
                        <Textarea
                          id="reminder-description"
                          placeholder="Add details..."
                          value={reminderForm.description}
                          onChange={(e) =>
                            setReminderForm({
                              ...reminderForm,
                              description: e.target.value,
                            })
                          }
                          rows={3}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="reminder-date">Date *</Label>
                          <Input
                            id="reminder-date"
                            type="date"
                            value={reminderForm.date}
                            onChange={(e) =>
                              setReminderForm({
                                ...reminderForm,
                                date: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="reminder-time">Time *</Label>
                          <Input
                            id="reminder-time"
                            type="time"
                            value={reminderForm.time}
                            onChange={(e) =>
                              setReminderForm({
                                ...reminderForm,
                                time: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="reminder-type">Type</Label>
                        <select
                          id="reminder-type"
                          className="w-full px-3 py-2 border border-input bg-background rounded-md"
                          value={reminderForm.type}
                          onChange={(e) =>
                            setReminderForm({
                              ...reminderForm,
                              type: e.target.value as Reminder["type"],
                            })
                          }
                        >
                          <option value="meeting">Meeting</option>
                          <option value="test">Test</option>
                          <option value="event">Event</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setReminderDialogOpen(false);
                          setEditingReminder(null);
                          setReminderForm({
                            title: "",
                            description: "",
                            date: "",
                            time: "",
                            type: "other",
                          });
                        }}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleAddReminder}>
                        {editingReminder ? "Update" : "Save"} Reminder
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {/* Upcoming Reminders */}
              {upcomingReminders.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold mb-2 text-orange-600">
                    Upcoming
                  </h4>
                  <div className="space-y-2">
                    {upcomingReminders.map((reminder) => (
                      <div
                        key={reminder.id}
                        className="p-3 bg-orange-50 rounded-lg border border-orange-200"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full ${getReminderTypeColor(
                                  reminder.type
                                )}`}
                              >
                                {reminder.type}
                              </span>
                              <span className="font-medium text-sm">
                                {reminder.title}
                              </span>
                            </div>
                            {reminder.description && (
                              <p className="text-xs text-muted-foreground mb-1">
                                {reminder.description}
                              </p>
                            )}
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatDate(reminder.date)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatTime(reminder.time)}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2"
                              onClick={() => handleEditReminder(reminder)}
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-red-600 hover:text-red-700"
                              onClick={() => handleDeleteReminder(reminder.id)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* All Reminders */}
              <div>
                <h4 className="text-sm font-semibold mb-2">All Reminders</h4>
                {reminders.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No reminders yet. Add your first reminder!</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {reminders
                      .sort((a, b) => {
                        const dateA = new Date(`${a.date}T${a.time}`);
                        const dateB = new Date(`${b.date}T${b.time}`);
                        return dateB.getTime() - dateA.getTime();
                      })
                      .map((reminder) => (
                        <div
                          key={reminder.id}
                          className={`p-3 rounded-lg border ${
                            reminder.completed
                              ? "bg-gray-50 border-gray-200 opacity-60"
                              : "bg-white border-gray-200"
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <input
                                  type="checkbox"
                                  checked={reminder.completed}
                                  onChange={() =>
                                    handleToggleReminder(reminder.id)
                                  }
                                  className="rounded"
                                />
                                <span
                                  className={`text-xs px-2 py-0.5 rounded-full ${getReminderTypeColor(
                                    reminder.type
                                  )}`}
                                >
                                  {reminder.type}
                                </span>
                                <span
                                  className={`font-medium text-sm ${
                                    reminder.completed
                                      ? "line-through text-muted-foreground"
                                      : ""
                                  }`}
                                >
                                  {reminder.title}
                                </span>
                              </div>
                              {reminder.description && (
                                <p className="text-xs text-muted-foreground mb-1">
                                  {reminder.description}
                                </p>
                              )}
                              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {formatDate(reminder.date)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {formatTime(reminder.time)}
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2"
                                onClick={() => handleEditReminder(reminder)}
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2 text-red-600 hover:text-red-700"
                                onClick={() =>
                                  handleDeleteReminder(reminder.id)
                                }
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
