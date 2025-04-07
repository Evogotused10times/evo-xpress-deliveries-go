
import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Package,
  PackagePlus,
  User,
  LogOut,
  Home,
  BarChart,
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

type SidebarProps = {
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (isOpen: boolean) => void;
};

export function Sidebar({ isMobileSidebarOpen, setIsMobileSidebarOpen }: SidebarProps) {
  const location = useLocation();
  const { user, isAdmin, logout } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
    // Check if user has a preference for sidebar collapsed state
    const savedCollapsedState = localStorage.getItem('sidebar-collapsed');
    if (savedCollapsedState !== null) {
      setIsCollapsed(savedCollapsedState === 'true');
    }
  }, []);
  
  useEffect(() => {
    // Close mobile sidebar when route changes
    setIsMobileSidebarOpen(false);
  }, [location.pathname, setIsMobileSidebarOpen]);
  
  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  const toggleCollapsed = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('sidebar-collapsed', String(newState));
  };
  
  if (!isMounted) return null;

  const NavItemContent = ({ icon: Icon, label }: { icon: any; label: string }) => (
    <>
      <Icon className={cn("h-5 w-5 transition-all", isCollapsed ? "mx-auto" : "mr-2")} />
      {!isCollapsed && <span>{label}</span>}
    </>
  );
  
  const NavItem = ({ to, icon: Icon, label }: { to: string; icon: any; label: string }) => (
    <Tooltip delayDuration={300}>
      <TooltipTrigger asChild>
        <NavLink
          to={to}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-all duration-200",
              isCollapsed && "justify-center px-2",
              isActive
                ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-neon-sm"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )
          }
          onClick={closeMobileSidebar}
        >
          <NavItemContent icon={Icon} label={label} />
        </NavLink>
      </TooltipTrigger>
      {isCollapsed && (
        <TooltipContent side="right">{label}</TooltipContent>
      )}
    </Tooltip>
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
          "fixed inset-y-0 left-0 z-50 flex h-full flex-col border-r border-border/50 bg-sidebar transition-all duration-300 md:static md:z-0",
          isCollapsed ? "w-16" : "w-64",
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className={cn(
          "flex items-center gap-2 border-b border-border/50 p-4",
          isCollapsed && "justify-center"
        )}>
          <NavLink to="/" className="flex items-center gap-2" onClick={closeMobileSidebar}>
            <Package className="h-6 w-6 text-primary animate-float" />
            {!isCollapsed && <span className="font-bold text-xl text-shadow-neon-sm">EVO 3XPRESS</span>}
          </NavLink>
          
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto md:hidden"
            onClick={closeMobileSidebar}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Toggle collapse button (desktop only) */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleCollapsed}
          className="absolute -right-3 top-20 hidden md:flex h-6 w-6 items-center justify-center rounded-full bg-sidebar border border-border/50 shadow-md"
        >
          {isCollapsed ? 
            <ChevronRight className="h-4 w-4" /> : 
            <ChevronLeft className="h-4 w-4" />
          }
        </Button>
        
        <div className={cn(
          "flex-1 overflow-y-auto p-3",
          isCollapsed && "px-2"
        )}>
          <nav className="space-y-1 py-4">
            {isAdmin ? (
              <NavItem to="/admin" icon={BarChart} label="Admin Dashboard" />
            ) : (
              <NavItem to="/dashboard" icon={Home} label="Dashboard" />
            )}
            <NavItem to="/parcels" icon={Package} label="My Parcels" />
            <NavItem to="/parcels/create" icon={PackagePlus} label="Create Parcel" />
            <NavItem to="/profile" icon={User} label="Profile" />
          </nav>
        </div>
        
        <div className={cn(
          "mt-auto border-t border-border/50 p-3",
          isCollapsed && "px-2"
        )}>
          <div className={cn(
            "flex items-center gap-2 py-2 px-3",
            isCollapsed && "justify-center px-2"
          )}>
            <ThemeToggle />
            {!isCollapsed && <span className="text-sm">Theme</span>}
          </div>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "w-full flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  isCollapsed && "justify-center px-2"
                )}
                onClick={() => {
                  logout();
                  closeMobileSidebar();
                }}
              >
                <LogOut className="h-5 w-5" />
                {!isCollapsed && <span>Log Out</span>}
              </Button>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right">Log Out</TooltipContent>
            )}
          </Tooltip>
        </div>
      </div>
    </>
  );
}
