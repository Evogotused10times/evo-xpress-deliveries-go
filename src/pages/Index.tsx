
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Package, ArrowRight, ChevronDown, Shield, Clock, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";
import { ThemeToggle } from "@/components/layout/theme-toggle";

const Index = () => {
  const { isAuthenticated } = useAuth();
  
  // Just for demo purposes to show route navigation in console
  useEffect(() => {
    console.log("Landing page loaded");
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background via-background to-background/90 overflow-hidden">
      {/* Header */}
      <header className="flex h-16 items-center justify-between border-b border-border/40 px-4 md:px-6 backdrop-blur-sm sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <Package className="h-6 w-6 text-primary animate-float" />
          <span className="font-bold text-xl text-shadow-neon-sm">EVO 3XPRESS</span>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <div className="hidden md:flex gap-4">
            {isAuthenticated ? (
              <Button asChild className="hover-glow shadow-neon-sm">
                <Link to="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="ghost" className="hover-glow">
                  <Link to="/login">Log In</Link>
                </Button>
                <Button asChild className="relative overflow-hidden group">
                  <Link to="/register" className="z-10 flex items-center gap-1">
                    Sign Up
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-4 py-20 md:py-36 lg:py-48">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>
        <div className="container mx-auto grid items-center gap-8 md:grid-cols-2">
          <div className="flex flex-col gap-6 md:pr-12">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl animate-fade-in">
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">EVO 3XPRESS</span>
                <br />
                <span className="text-shadow-neon-sm text-neon-purple">Parcel mo, Sagot ko!</span>
              </h1>
              <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed animate-slide-in max-w-md">
                Your reliable parcel delivery solution in the Philippines. Fast, secure and always on time.
              </p>
            </div>
            <div className="flex flex-col gap-3 min-[400px]:flex-row">
              {isAuthenticated ? (
                <Button asChild size="lg" className="shadow-neon-sm group">
                  <Link to="/dashboard" className="flex items-center">
                    Track Your Parcels
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              ) : (
                <Button asChild size="lg" className="shadow-neon-sm group">
                  <Link to="/register" className="flex items-center">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              )}
              <Button variant="outline" size="lg" asChild className="backdrop-blur-sm border-primary/20 hover:bg-primary/10">
                <Link to="/login">Learn More</Link>
              </Button>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-secondary rounded-lg blur-md opacity-75 animate-pulse-slow"></div>
              <img
                src="https://via.placeholder.com/600x400?text=Delivery+Service"
                alt="Delivery Service"
                className="relative rounded-lg object-cover w-full border border-white/10"
              />
            </div>
            <div className="mt-4 flex justify-end">
              <a href="#features" className="flex flex-col items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <span>Scroll to learn more</span>
                <ChevronDown className="h-4 w-4 animate-bounce" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 md:py-24 lg:py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/5 to-transparent pointer-events-none"></div>
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="space-y-2 max-w-[800px]">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                Why Choose EVO 3XPRESS?
              </h2>
              <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                We provide the best delivery experience across the Philippines with our reliable services.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl gap-6 md:gap-8 sm:grid-cols-2 md:grid-cols-3">
            {[
              {
                title: "Fast Delivery",
                description: "Same day delivery within Metro Manila and 2-3 days nationwide.",
                icon: <Truck className="text-neon-blue" />
              },
              {
                title: "Secure Handling",
                description: "Your parcels are handled with care and fully insured during transit.",
                icon: <Shield className="text-neon-purple" />
              },
              {
                title: "Real-time Tracking",
                description: "Track your parcels in real-time with our advanced tracking system.",
                icon: <Clock className="text-neon-pink" />
              },
            ].map((feature, index) => (
              <div key={index} className="card-hover flex flex-col items-center space-y-3 rounded-lg border border-border/50 p-6 backdrop-blur-sm hover:border-primary/50">
                <div className="rounded-full border border-primary/30 p-3 shadow-neon-sm">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-shadow-neon-sm">{feature.title}</h3>
                <p className="text-center text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-16 md:py-24 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/10 to-transparent pointer-events-none"></div>
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-6 text-center">
            <div className="space-y-3 max-w-[600px]">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-shadow-neon-sm">
                Ready to Send Your Parcel?
              </h2>
              <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Sign up now and experience the best delivery service in the Philippines.
              </p>
              <div className="mx-auto max-w-sm space-y-2 py-4">
                {isAuthenticated ? (
                  <Button asChild size="lg" className="w-full shadow-neon-sm group">
                    <Link to="/parcels/create" className="flex items-center justify-center">
                      Create Parcel Order
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                ) : (
                  <Button asChild size="lg" className="w-full shadow-neon-sm group">
                    <Link to="/register" className="flex items-center justify-center">
                      Sign Up Now
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-border/40 bg-background/90 py-8 backdrop-blur-sm">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              <p className="text-sm text-muted-foreground">
                © 2025 EVO 3XPRESS. All rights reserved.
              </p>
            </div>
            <div className="flex gap-4">
              <Link to="#" className="text-sm text-muted-foreground hover:text-foreground hover-glow">
                Terms of Service
              </Link>
              <Link to="#" className="text-sm text-muted-foreground hover:text-foreground hover-glow">
                Privacy Policy
              </Link>
              <Link to="#" className="text-sm text-muted-foreground hover:text-foreground hover-glow">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
