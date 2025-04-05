
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/providers/theme-provider";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Parcels from "./pages/Parcels";
import CreateParcel from "./pages/CreateParcel";
import ParcelDetails from "./pages/ParcelDetails";
import AdminDashboard from "./pages/AdminDashboard";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./providers/auth-provider";
import AuthGuard from "./components/guards/auth-guard";
import AdminGuard from "./components/guards/admin-guard";
import Layout from "./components/layout/layout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="evo-theme">
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected Routes */}
              <Route element={<AuthGuard />}>
                <Route element={<Layout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/parcels" element={<Parcels />} />
                  <Route path="/parcels/create" element={<CreateParcel />} />
                  <Route path="/parcels/:id" element={<ParcelDetails />} />
                  <Route path="/profile" element={<Profile />} />
                </Route>
              </Route>
              
              {/* Admin Routes */}
              <Route element={<AdminGuard />}>
                <Route element={<Layout />}>
                  <Route path="/admin" element={<AdminDashboard />} />
                </Route>
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
