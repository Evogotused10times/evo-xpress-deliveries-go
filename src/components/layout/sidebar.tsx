
import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Package,
  PackagePlus,
  User,
  Settings,
  LogOut,
  Home,
  BarChart,
  MenuIcon,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";

type SidebarProps = {
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (isOpen: boolean) => void;
};

export function Sidebar({ isMobileSidebarOpen, setIsMobileSidebarOpen }: SidebarProps) {
  const location = useLocation();
  const { user, isAdmin, logout } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  useEffect(() => {
    // Close mobile sidebar when route changes
    setIsMobileSidebarOpen(false);
  }, [location.pathname, setIsMobileSidebarOpen]);
  
  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };
  
  if (!isMounted) return null;
  
  const NavItem = ({ to, icon: Icon, label }: { to: string; icon: any; label: string }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
          isActive
            ? "bg-sidebar-accent text-sidebar-accent-foreground"
            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        )
      }
      onClick={closeMobileSidebar}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </NavLink>
  );
  
  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={closeMobileSidebar}
        />
      )}
      
      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-full w-72 flex-col border-r bg-sidebar p-4 transition-transform duration-200 md:static md:z-0",
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex items-center justify-between mb-4">
          <NavLink to="/" className="flex items-center gap-2" onClick={closeMobileSidebar}>
            <Package className="h-6 w-6 text-evo-purple" />
            <span className="font-bold text-xl">EVO 3XPRESS</span>
          </NavLink>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={closeMobileSidebar}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="space-y-1 py-2">
          {isAdmin ? (
            <NavItem to="/admin" icon={BarChart} label="Admin Dashboard" />
          ) : (
            <NavItem to="/dashboard" icon={Home} label="Dashboard" />
          )}
          <NavItem to="/parcels" icon={Package} label="My Parcels" />
          <NavItem to="/parcels/create" icon={PackagePlus} label="Create Parcel" />
          <NavItem to="/profile" icon={User} label="Profile" />
        </div>
        
        <div className="mt-auto space-y-1 py-2">
          <div className="flex items-center gap-2 px-3 py-2">
            <ThemeToggle />
            <span className="text-sm">Toggle Theme</span>
          </div>
          <Button
            variant="ghost"
            className="flex w-full items-center justify-start gap-3 rounded-md px-3 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            onClick={() => {
              logout();
              closeMobileSidebar();
            }}
          >
            <LogOut className="h-4 w-4" />
            <span>Log Out</span>
          </Button>
        </div>
      </div>
    </>
  );
}
