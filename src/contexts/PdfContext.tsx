import React, { createContext, useContext, useState, ReactNode } from "react";

interface PdfContextType {
  selectedPdfUrl: string | undefined;
  selectedPdfTitle: string | undefined;
  setPdf: (url: string, title: string) => void;
  clearPdf: () => void;
}

const PdfContext = createContext<PdfContextType | undefined>(undefined);

export function PdfProvider({ children }: { children?: ReactNode }) {
  const [selectedPdfUrl, setSelectedPdfUrl] = useState<string | undefined>();
  const [selectedPdfTitle, setSelectedPdfTitle] = useState<
    string | undefined
  >();

  const setPdf = (url: string, title: string) => {
    setSelectedPdfUrl(url);
    setSelectedPdfTitle(title);
  };

  const clearPdf = () => {
    setSelectedPdfUrl(undefined);
    setSelectedPdfTitle(undefined);
  };

  return (
    <PdfContext.Provider
      value={{ selectedPdfUrl, selectedPdfTitle, setPdf, clearPdf }}
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
