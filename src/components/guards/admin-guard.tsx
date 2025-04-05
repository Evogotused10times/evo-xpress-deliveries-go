
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/providers/auth-provider";

const AdminGuard = () => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  
  // Show loading or redirect if not authenticated or not admin
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <Outlet />;
};

export default AdminGuard;
