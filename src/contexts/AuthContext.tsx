import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

type UserRole = "student" | "parent" | "teacher" | "school" | null;

interface UserData {
  id: string;
  name: string;
  persona: UserRole;
  contact_email?: string;
  contact_phone?: string;
  city?: string;
  state?: string;
  board_affiliation?: string;
  created_at?: string;
  [key: string]: any; // For additional fields
}

interface AuthContextType {
  userRole: UserRole;
  userData: UserData | null;
  accessToken: string | null;
  setUserRole: (role: UserRole) => void;
  setUserData: (data: UserData | null) => void;
  setAccessToken: (token: string | null) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEYS = {
  TOKEN: "authToken",
  USER_DATA: "userData",
  USER_ROLE: "userRole",
};

export function AuthProvider({ children }: { children?: ReactNode }) {
  // Initialize from localStorage
  const [userRole, setUserRoleState] = useState<UserRole>(() => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEYS.USER_ROLE);
    return (stored as UserRole) || null;
  });

  const [userData, setUserDataState] = useState<UserData | null>(() => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEYS.USER_DATA);
    return stored ? JSON.parse(stored) : null;
  });

  const [accessToken, setAccessTokenState] = useState<string | null>(() => {
    return localStorage.getItem(AUTH_STORAGE_KEYS.TOKEN);
  });

  // Sync state changes to localStorage
  const setUserRole = (role: UserRole) => {
    setUserRoleState(role);
    if (role) {
      localStorage.setItem(AUTH_STORAGE_KEYS.USER_ROLE, role);
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEYS.USER_ROLE);
    }
  };

  const setUserData = (data: UserData | null) => {
    setUserDataState(data);
    if (data) {
      localStorage.setItem(AUTH_STORAGE_KEYS.USER_DATA, JSON.stringify(data));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEYS.USER_DATA);
    }
  };

  const setAccessToken = (token: string | null) => {
    setAccessTokenState(token);
    if (token) {
      localStorage.setItem(AUTH_STORAGE_KEYS.TOKEN, token);
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN);
    }
  };

  const logout = () => {
    setUserRole(null);
    setUserData(null);
    setAccessToken(null);
    // Clear all auth-related localStorage items
    Object.values(AUTH_STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  };

  // User is authenticated if they have a role (token may be null from API)
  const isAuthenticated = !!userRole;

  return (
    <AuthContext.Provider
      value={{
        userRole,
        userData,
        accessToken,
        setUserRole,
        setUserData,
        setAccessToken,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
