
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Package, ArrowRight } from "lucide-react";
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
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="flex h-16 items-center justify-between border-b px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Package className="h-6 w-6 text-evo-purple" />
          <span className="font-bold text-xl">EVO 3XPRESS</span>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <div className="hidden md:flex gap-4">
            {isAuthenticated ? (
              <Button asChild>
                <Link to="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="ghost">
                  <Link to="/login">Log In</Link>
                </Button>
                <Button asChild>
                  <Link to="/register">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-background to-secondary/20 px-4 py-12 md:py-24 lg:py-32">
        <div className="container mx-auto grid items-center gap-6 md:grid-cols-2">
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl animate-fade-in">
              EVO 3XPRESS<br/>
              <span className="text-evo-purple">Parcel mo, Sagot ko!</span>
            </h1>
            <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed animate-slide-in">
              Your reliable parcel delivery solution in the Philippines. Fast, secure and always on time.
            </p>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              {isAuthenticated ? (
                <Button asChild size="lg" className="sm:text-lg">
                  <Link to="/dashboard">
                    Track Your Parcels
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <Button asChild size="lg" className="sm:text-lg">
                  <Link to="/register">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              )}
              <Button variant="outline" size="lg" asChild className="sm:text-lg">
                <Link to="/login">Learn More</Link>
              </Button>
            </div>
          </div>
          <div className="hidden md:block">
            <img
              src="https://via.placeholder.com/600x400?text=Delivery+Service"
              alt="Delivery Service"
              className="rounded-lg object-cover w-full"
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 md:py-24 lg:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Why Choose EVO 3XPRESS?
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                We provide the best delivery experience across the Philippines with our reliable services.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 md:grid-cols-3">
            {[
              {
                title: "Fast Delivery",
                description: "Same day delivery within Metro Manila and 2-3 days nationwide.",
              },
              {
                title: "Secure Handling",
                description: "Your parcels are handled with care and fully insured during transit.",
              },
              {
                title: "Real-time Tracking",
                description: "Track your parcels in real-time with our advanced tracking system.",
              },
            ].map((feature, index) => (
              <div key={index} className="flex flex-col items-center space-y-2 rounded-lg border p-4 hover:bg-secondary/50 transition-colors animate-fade-in">
                <div className="rounded-full border p-2">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">{feature.title}</h3>
                <p className="text-center text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-secondary/80 py-12 md:py-24 lg:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Ready to Send Your Parcel?
              </h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Sign up now and experience the best delivery service in the Philippines.
              </p>
              <div className="mx-auto max-w-sm space-y-2 py-4">
                {isAuthenticated ? (
                  <Button asChild size="lg" className="w-full">
                    <Link to="/parcels/create">Create Parcel Order</Link>
                  </Button>
                ) : (
                  <Button asChild size="lg" className="w-full">
                    <Link to="/register">Sign Up Now</Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background py-6 md:py-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              <p className="text-sm text-muted-foreground">
                © 2025 EVO 3XPRESS. All rights reserved.
              </p>
            </div>
            <div className="flex gap-4">
              <Link to="#" className="text-sm text-muted-foreground hover:underline">
                Terms of Service
              </Link>
              <Link to="#" className="text-sm text-muted-foreground hover:underline">
                Privacy Policy
              </Link>
              <Link to="#" className="text-sm text-muted-foreground hover:underline">
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
