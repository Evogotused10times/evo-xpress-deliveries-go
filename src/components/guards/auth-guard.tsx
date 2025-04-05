
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/providers/auth-provider";

const AuthGuard = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Show loading or redirect if not authenticated
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <Outlet />;
};

export default AuthGuard;
