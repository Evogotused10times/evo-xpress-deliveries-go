
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./sidebar";
import { Button } from "@/components/ui/button";
import { MenuIcon } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";

const Layout = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { user } = useAuth();
  
  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-background via-background to-background/95">
      {/* Sidebar */}
      <Sidebar 
        isMobileSidebarOpen={isMobileSidebarOpen}
        setIsMobileSidebarOpen={setIsMobileSidebarOpen}
      />
      
      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile header */}
        <header className="flex h-14 items-center justify-between gap-4 border-b border-border/40 bg-background/80 backdrop-blur-md px-4 lg:h-[60px] md:hidden">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle sidebar"
              className="md:hidden"
              onClick={() => setIsMobileSidebarOpen(true)}
            >
              <MenuIcon className="h-5 w-5" />
            </Button>
            <span className="font-semibold text-shadow-neon-sm">EVO 3XPRESS</span>
          </div>
          
          {user && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Welcome, {user.name || user.email}</span>
            </div>
          )}
        </header>
        
        {/* Desktop header - simplified for better UX */}
        <header className="hidden md:flex h-14 items-center justify-between gap-4 border-b border-border/40 bg-background/80 backdrop-blur-md px-6">
          <h1 className="text-lg font-semibold tracking-tight">
            <span className="text-primary text-shadow-neon-sm">EVO</span> 3XPRESS
          </h1>
          
          {user && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Welcome, {user.name || user.email}</span>
            </div>
          )}
        </header>
        
        {/* Content area with improved scrolling and padding */}
        <main className="flex-1 overflow-y-auto scrollbar-none p-4 md:p-6">
          <div className="animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
