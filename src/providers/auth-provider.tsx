
import { createContext, useContext, useEffect, useState } from "react";

type User = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Check if user exists in localStorage
    const storedUser = localStorage.getItem("evo-user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);
  
  // Mock login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API call
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        // Demo users
        if (email === "admin@evoexpress.com" && password === "password") {
          const adminUser = {
            id: "admin-123",
            name: "Admin User",
            email: "admin@evoexpress.com",
            role: "admin" as const
          };
          setUser(adminUser);
          localStorage.setItem("evo-user", JSON.stringify(adminUser));
          setIsLoading(false);
          resolve();
        } else if (email === "user@example.com" && password === "password") {
          const regularUser = {
            id: "user-456",
            name: "Regular User",
            email: "user@example.com",
            role: "user" as const
          };
          setUser(regularUser);
          localStorage.setItem("evo-user", JSON.stringify(regularUser));
          setIsLoading(false);
          resolve();
        } else {
          setIsLoading(false);
          reject(new Error("Invalid email or password"));
        }
      }, 1000); // Simulate network delay
    });
  };
  
  // Mock register function
  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API call
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        // Check if email already exists
        if (email === "admin@evoexpress.com" || email === "user@example.com") {
          setIsLoading(false);
          reject(new Error("Email already in use"));
          return;
        }
        
        const newUser = {
          id: `user-${Math.random().toString(36).substring(2, 9)}`,
          name,
          email,
          role: "user" as const
        };
        
        setUser(newUser);
        localStorage.setItem("evo-user", JSON.stringify(newUser));
        setIsLoading(false);
        resolve();
      }, 1000); // Simulate network delay
    });
  };
  
  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("evo-user");
  };
  
  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin"
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
};
