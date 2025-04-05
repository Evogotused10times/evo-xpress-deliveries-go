
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, PackagePlus, Truck, Clock, CircleDollarSign } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/stats/stat-card";
import { ParcelCard } from "@/components/parcel/parcel-card";
import { useAuth } from "@/providers/auth-provider";
import { getUserParcels } from "@/services/parcel-service";
import type { Parcel } from "@/models/parcel";

const Dashboard = () => {
  const { user } = useAuth();
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchParcels = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const userParcels = await getUserParcels(user.id);
        setParcels(userParcels);
      } catch (err) {
        console.error("Error fetching parcels:", err);
        setError("Failed to load parcels. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchParcels();
  }, [user]);
  
  // Calculate stats
  const totalParcels = parcels.length;
  const inTransitParcels = parcels.filter(p => 
    ['accepted', 'picked_up', 'in_transit', 'out_for_delivery'].includes(p.status)
  ).length;
  const deliveredParcels = parcels.filter(p => p.status === 'delivered').length;
  const totalSpent = parcels.reduce((sum, p) => sum + p.price, 0).toFixed(2);
  
  // Get recent parcels (last 3)
  const recentParcels = [...parcels].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 3);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.name || "User"}!
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Parcels"
          value={totalParcels}
          icon={<Package className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="In Transit"
          value={inTransitParcels}
          icon={<Truck className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="Delivered"
          value={deliveredParcels}
          icon={<Clock className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="Total Spent"
          value={`₱${totalSpent}`}
          icon={<CircleDollarSign className="h-4 w-4 text-muted-foreground" />}
        />
      </div>
      
      <div className="grid gap-4 lg:grid-cols-7">
        {/* Recent Parcels */}
        <Card className="lg:col-span-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Parcels</CardTitle>
              <CardDescription>Your recently created parcels</CardDescription>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link to="/parcels">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center p-4">
                <div className="animate-pulse">Loading parcels...</div>
              </div>
            ) : error ? (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            ) : recentParcels.length === 0 ? (
              <div className="flex flex-col items-center justify-center space-y-3 py-12">
                <Package className="h-12 w-12 text-muted-foreground/70" />
                <div className="text-center">
                  <p className="text-lg font-medium">No parcels yet</p>
                  <p className="text-sm text-muted-foreground">
                    Create your first parcel to get started
                  </p>
                </div>
                <Button asChild>
                  <Link to="/parcels/create">
                    <PackagePlus className="mr-2 h-4 w-4" />
                    Create Parcel
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {recentParcels.map((parcel) => (
                  <ParcelCard key={parcel.id} parcel={parcel} />
                ))}
                
                {recentParcels.length > 0 && recentParcels.length < 3 && (
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/parcels/create">
                      <PackagePlus className="mr-2 h-4 w-4" />
                      Create New Parcel
                    </Link>
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Quick Actions */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used actions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full" size="lg">
              <Link to="/parcels/create">
                <PackagePlus className="mr-2 h-5 w-5" />
                Create New Parcel
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="w-full" size="lg">
              <Link to="/parcels">
                <Package className="mr-2 h-5 w-5" />
                View All Parcels
              </Link>
            </Button>
            
            <div className="rounded-md bg-muted p-4">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-primary/10 p-2">
                  <Truck className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-medium">Need help with shipping?</h4>
                  <p className="text-sm text-muted-foreground">
                    Contact our support team for assistance.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
