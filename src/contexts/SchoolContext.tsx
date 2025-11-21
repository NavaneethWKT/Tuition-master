import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface SchoolData {
  // School Basic Information
  schoolName: string;
  establishmentYear: string;
  boardAffiliation: string;

  // Contact Information
  email: string;
  phone: string;

  // Address Information
  city: string;
  state: string;
  pincode: string;

  // Administrative Details
  principalName: string;
  principalEmail: string;
  principalPhone: string;
  adminName: string;
  adminEmail: string;
  adminPhone: string;
}

interface SchoolContextType {
  schoolData: SchoolData | null;
  setSchoolData: (data: SchoolData) => void;
  clearSchoolData: () => void;
}

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

export function SchoolProvider({ children }: { children?: ReactNode }) {
  const [schoolData, setSchoolDataState] = useState<SchoolData | null>(null);

  // Load school data from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("schoolData");
    if (stored) {
      try {
        setSchoolDataState(JSON.parse(stored));
      } catch (error) {
        console.error("Error loading school data:", error);
      }
    }
  }, []);

  const setSchoolData = (data: SchoolData) => {
    setSchoolDataState(data);
    localStorage.setItem("schoolData", JSON.stringify(data));
  };

  const clearSchoolData = () => {
    setSchoolDataState(null);
    localStorage.removeItem("schoolData");
  };

  return (
    <SchoolContext.Provider
      value={{ schoolData, setSchoolData, clearSchoolData }}
    >
      {children}
    </SchoolContext.Provider>
  );
}

export function useSchool() {
  const context = useContext(SchoolContext);
  if (context === undefined) {
    throw new Error("useSchool must be used within a SchoolProvider");
  }
  return context;
}
