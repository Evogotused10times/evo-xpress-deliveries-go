
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./sidebar";
import { Button } from "@/components/ui/button";
import { MenuIcon } from "lucide-react";

const Layout = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar 
        isMobileSidebarOpen={isMobileSidebarOpen}
        setIsMobileSidebarOpen={setIsMobileSidebarOpen}
      />
      
      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile header */}
        <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] md:hidden">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle sidebar"
            className="md:hidden"
            onClick={() => setIsMobileSidebarOpen(true)}
          >
            <MenuIcon className="h-5 w-5" />
          </Button>
          <span className="font-semibold">EVO 3XPRESS</span>
        </header>
        
        {/* Content area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
