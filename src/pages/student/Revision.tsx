import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
  Upload,
  FileText,
  Sparkles,
  CheckCircle2,
  Star,
  Loader2,
} from "lucide-react";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Progress } from "../../components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { PageHeader } from "../../components/PageHeader";
import { useAuth } from "../../contexts/AuthContext";
import apiClient from "../../services/apiClient";

export function Revision() {
  const navigate = useNavigate();
  const { userData } = useAuth();
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>("");
  const [selectedMaterial, setSelectedMaterial] = useState<any | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const [revisions, setRevisions] = useState<any[]>([]);
  const [loadingRevisions, setLoadingRevisions] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [materials, setMaterials] = useState<any[]>([]);
  const [loadingMaterials, setLoadingMaterials] = useState(false);
  const [materialsError, setMaterialsError] = useState<string | null>(null);

  const [generatedSummary, setGeneratedSummary] = useState<any | null>(null);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  // Fetch revisions and materials when component mounts
  useEffect(() => {
    if (userData?.id) {
      fetchRevisions();
      fetchMaterials();
    }
  }, [userData?.id]);

  const fetchRevisions = async () => {
    if (!userData?.id) return;
    setLoadingRevisions(true);
    setError(null);
    try {
      const response = await apiClient.getStudentRevisions(userData.id);
      // Handle both array and single object responses
      if (Array.isArray(response)) {
        setRevisions(response);
      } else if (response && typeof response === "object") {
        // If it's a single revision object, wrap it in an array
        setRevisions([response]);
      } else {
        setRevisions([]);
      }
    } catch (err: any) {
      console.error("Error fetching revisions:", err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to fetch revisions. Please try again."
      );
    } finally {
      setLoadingRevisions(false);
    }
  };

  const fetchMaterials = async () => {
    if (!userData?.id) return;
    setLoadingMaterials(true);
    setMaterialsError(null);
    try {
      const response = await apiClient.getStudentClassMaterials(userData.id);
      setMaterials(
        Array.isArray(response?.materials) ? response.materials : []
      );
    } catch (err: any) {
      console.error("Error fetching materials:", err);
      setMaterialsError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to fetch materials. Please try again."
      );
    } finally {
      setLoadingMaterials(false);
    }
  };

  const handleMaterialSelect = (materialId: string) => {
    setSelectedMaterialId(materialId);
    const material = materials.find((m) => m.id === materialId);
    setSelectedMaterial(material || null);
    setShowSummary(false);
    setGeneratedSummary(null);
    setSummaryError(null);
  };

  const handleProcessPDF = async () => {
    if (!selectedMaterialId || !userData?.id) return;

    setIsProcessing(true);
    setSummaryError(null);
    setGeneratedSummary(null);

    try {
      // Step 1: Generate pointers
      const pointersResponse = await apiClient.generatePointers(
        selectedMaterialId
      );

      if (!pointersResponse.success) {
        throw new Error(
          pointersResponse.error || "Failed to generate pointers"
        );
      }

      // Set the generated summary
      setGeneratedSummary(pointersResponse);
      setShowSummary(true);

      // Step 2: Save revision
      const revisionData = {
        student_id: userData.id,
        subject: pointersResponse.subject || "",
        class_level: pointersResponse.class_level || "",
        chapter: pointersResponse.chapter || "",
        pointers: pointersResponse.pointers || [],
        total_pointers: pointersResponse.total_pointers || 0,
      };

      await apiClient.saveRevision(revisionData);

      // Refresh revisions list
      await fetchRevisions();
    } catch (err: any) {
      console.error("Error generating summary:", err);
      setSummaryError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Failed to generate summary. Please try again."
      );
      setShowSummary(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes || bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="min-h-screen bg-paper">
      <PageHeader
        title="Revision Center"
        subtitle="Review your saved topics and generate AI summaries"
        showBackButton={true}
        backRoute="/student/dashboard"
      />

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 max-w-6xl space-y-6">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Left Section - Saved Topics */}
          <div className="md:col-span-1 space-y-6">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle>History</CardTitle>
              </CardHeader>
              <CardContent>
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}
                <ScrollArea className="h-[600px] pr-4">
                  {loadingRevisions ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                      <span className="ml-2 text-muted-foreground">
                        Loading revisions...
                      </span>
                    </div>
                  ) : revisions.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      No revisions found
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {revisions.map((revision, index) => (
                        <button
                          key={index}
                          className="w-full text-left p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors group"
                        >
                          <h4 className="font-medium mb-1 group-hover:text-primary transition-colors">
                            {revision.chapter || "Untitled Chapter"}
                          </h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            {revision.subject || "No subject"}
                          </p>
                        </button>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Right Section - Upload & Summary */}
          <div className="md:col-span-2 space-y-6">
            {/* Upload Section */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  AI-Powered Summary Generator
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Select a study material from your class notes to get an
                  AI-generated summary with key points, formulas, and study
                  tips.
                </p>

                {materialsError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">{materialsError}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Select Material *
                  </label>
                  <Select
                    value={selectedMaterialId}
                    onValueChange={handleMaterialSelect}
                    disabled={loadingMaterials}
                  >
                    <SelectTrigger
                      className="w-full"
                      style={{
                        height: "40px",
                        minHeight: "30px",
                        marginTop: 10,
                      }}
                    >
                      <SelectValue placeholder="Choose a material from your class notes">
                        {selectedMaterial && (
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-primary shrink-0" />
                            <span className="truncate">
                              {selectedMaterial.title || "Untitled"}
                            </span>
                          </div>
                        )}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {loadingMaterials ? (
                        <SelectItem
                          value="loading"
                          disabled
                          className="h-12 py-3"
                        >
                          <div className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                            <span>Loading materials...</span>
                          </div>
                        </SelectItem>
                      ) : materials.length === 0 ? (
                        <SelectItem value="none" disabled className="h-12 py-3">
                          No materials available
                        </SelectItem>
                      ) : (
                        materials.map((material) => (
                          <SelectItem
                            key={material.id}
                            value={material.id}
                            className="h-12 py-3"
                          >
                            <div className="flex items-center gap-3 w-full">
                              <FileText className="w-4 h-4 text-primary shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="font-medium truncate text-sm">
                                  {material.title || "Untitled"}
                                </p>
                                {material.subject_name && (
                                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                                    {material.subject_name}
                                  </p>
                                )}
                              </div>
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {selectedMaterial && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-50 border border-blue-200">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5 text-red-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-blue-900 truncate">
                          {selectedMaterial.title || "Untitled"}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-blue-700">
                          {selectedMaterial.subject_name && (
                            <span>{selectedMaterial.subject_name}</span>
                          )}
                          {selectedMaterial.file_type && (
                            <>
                              <span>•</span>
                              <span>{selectedMaterial.file_type}</span>
                            </>
                          )}
                          {selectedMaterial.file_size && (
                            <>
                              <span>•</span>
                              <span>
                                {formatFileSize(selectedMaterial.file_size)}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedMaterialId("");
                          setSelectedMaterial(null);
                          setShowSummary(false);
                          setGeneratedSummary(null);
                          setSummaryError(null);
                        }}
                      >
                        Remove
                      </Button>
                    </div>

                    {!showSummary && (
                      <Button
                        onClick={handleProcessPDF}
                        disabled={isProcessing || !selectedMaterialId}
                        className="w-full gap-2"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Generating Summary...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4" />
                            Generate AI Summary
                          </>
                        )}
                      </Button>
                    )}

                    {isProcessing && (
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          AI is analyzing your document...
                        </p>
                        <Progress value={66} className="h-2" />
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Summary Display */}
            {showSummary && (
              <Card className="shadow-lg border-0 border-l-4 border-l-primary">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      AI-Generated Summary
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  {summaryError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-sm text-red-600">{summaryError}</p>
                    </div>
                  )}
                  {generatedSummary && (
                    <ScrollArea className="h-[500px] pr-4">
                      <div className="space-y-6">
                        {/* Chapter Name */}
                        <div className="space-y-3">
                          <h2 className="text-2xl font-bold text-gray-800">
                            {generatedSummary.chapter || "Untitled Chapter"}
                          </h2>
                          {(generatedSummary.subject ||
                            generatedSummary.class_level) && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              {generatedSummary.subject && (
                                <span>{generatedSummary.subject}</span>
                              )}
                              {generatedSummary.subject &&
                                generatedSummary.class_level && <span>•</span>}
                              {generatedSummary.class_level && (
                                <span>
                                  Class {generatedSummary.class_level}
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Pointers */}
                        <div className="space-y-3">
                          <h3 className="text-lg font-semibold text-gray-800">
                            Key Pointers
                            {generatedSummary.total_pointers !== undefined && (
                              <span className="text-sm font-normal text-muted-foreground ml-2">
                                ({generatedSummary.total_pointers} points)
                              </span>
                            )}
                          </h3>
                          {generatedSummary.pointers &&
                          generatedSummary.pointers.length > 0 ? (
                            <ul className="space-y-3">
                              {generatedSummary.pointers.map(
                                (pointer: string, index: number) => (
                                  <li
                                    key={index}
                                    className="flex items-start gap-3 text-gray-700"
                                  >
                                    <span className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0" />
                                    <span className="flex-1">{pointer}</span>
                                  </li>
                                )
                              )}
                            </ul>
                          ) : (
                            <p className="text-muted-foreground">
                              No pointers generated yet.
                            </p>
                          )}
                        </div>
                      </div>
                    </ScrollArea>
                  )}
                  {!generatedSummary && !summaryError && (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                      <span className="ml-2 text-muted-foreground">
                        Generating summary...
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
