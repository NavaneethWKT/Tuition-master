import React, { createContext, useContext, useState, ReactNode } from "react";

interface PdfContextType {
  selectedPdfUrl: string | undefined;
  selectedPdfTitle: string | undefined;
  selectedPdfMaterialId: string | undefined;
  setPdf: (url: string, title: string, materialId?: string) => void;
  clearPdf: () => void;
}

const PdfContext = createContext<PdfContextType | undefined>(undefined);

export function PdfProvider({ children }: { children?: ReactNode }) {
  const [selectedPdfUrl, setSelectedPdfUrl] = useState<string | undefined>();
  const [selectedPdfTitle, setSelectedPdfTitle] = useState<
    string | undefined
  >();
  const [selectedPdfMaterialId, setSelectedPdfMaterialId] = useState<
    string | undefined
  >();

  const setPdf = (url: string, title: string, materialId?: string) => {
    setSelectedPdfUrl(url);
    setSelectedPdfTitle(title);
    setSelectedPdfMaterialId(materialId);
  };

  const clearPdf = () => {
    setSelectedPdfUrl(undefined);
    setSelectedPdfTitle(undefined);
    setSelectedPdfMaterialId(undefined);
  };

  return (
    <PdfContext.Provider
      value={{
        selectedPdfUrl,
        selectedPdfTitle,
        selectedPdfMaterialId,
        setPdf,
        clearPdf,
      }}
    >
      {children}
    </PdfContext.Provider>
  );
}

export function usePdf() {
  const context = useContext(PdfContext);
  if (context === undefined) {
    throw new Error("usePdf must be used within a PdfProvider");
  }
  return context;
}
