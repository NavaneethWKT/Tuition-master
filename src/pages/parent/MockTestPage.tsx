import React from "react";
import PdfQnAUploader from "../../components/PdfQnAUploader";
import { PageHeader } from "../../components/PageHeader";
import { FlaskConical } from "lucide-react";

export default function ParentMockTestPage() {
  return (
    <div className="min-h-screen bg-paper">
      <PageHeader
        title="Generate Mock Test"
        subtitle="Upload a PDF to generate questions and review your child's answers"
        showBackButton={true}
        backRoute="/parent/dashboard"
        icon={
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
            <FlaskConical className="w-6 h-6 text-white" />
          </div>
        }
      />

      <main className="container mx-auto px-6 py-8 max-w-4xl">
        <PdfQnAUploader role="parent" />
      </main>
    </div>
  );
}
