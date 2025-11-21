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
  schoolType: string;
  establishmentYear: string;
  boardAffiliation: string;
  schoolCategory: string;

  // Contact Information
  email: string;
  phone: string;
  alternatePhone: string;
  website: string;

  // Address Information
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  country: string;

  // Administrative Details
  principalName: string;
  principalEmail: string;
  principalPhone: string;
  adminName: string;
  adminEmail: string;
  adminPhone: string;

  // School Infrastructure
  totalClassrooms: string;
  totalLabs: string;
  libraryAvailable: string;
  playgroundAvailable: string;
  computerLabAvailable: string;
  scienceLabAvailable: string;
  auditoriumAvailable: string;
  canteenAvailable: string;

  // Academic Information
  academicYearStart: string;
  academicYearEnd: string;
  totalStudents: string;
  totalTeachers: string;
  totalStaff: string;
  gradesOffered: string[];
  mediumOfInstruction: string;

  // Facilities & Features
  transportFacility: string;
  hostelFacility: string;
  sportsFacility: string;
  extracurricularActivities: string;

  // Additional Information
  description: string;
  vision: string;
  mission: string;
  achievements: string;
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
