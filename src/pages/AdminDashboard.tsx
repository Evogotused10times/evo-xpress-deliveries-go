
import { useEffect, useState } from "react";
import {
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  PackagePlus,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/stats/stat-card";
import { useAuth } from "@/providers/auth-provider";
import { getAllParcels, updateParcelStatus } from "@/services/parcel-service";
import { StatusBadge } from "@/components/ui/status-badge";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";
import type { Parcel, DeliveryStatus } from "@/models/parcel";

const AdminDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchParcels = async () => {
      try {
        setLoading(true);
        const allParcels = await getAllParcels();
        setParcels(allParcels);
      } catch (err) {
        console.error("Error fetching parcels:", err);
        setError("Failed to load parcels. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchParcels();
  }, []);
  
  const handleUpdateStatus = async (id: string, newStatus: DeliveryStatus) => {
    try {
      setIsUpdating(id);
      const updatedParcel = await updateParcelStatus(id, newStatus);
      
      // Update the parcel in the state
      setParcels((prevParcels) =>
        prevParcels.map((p) => (p.id === id ? updatedParcel : p))
      );
      
      toast({
        title: "Status Updated",
        description: `Parcel status updated to ${newStatus.replace("_", " ")}.`,
      });
    } catch (err) {
      console.error("Error updating status:", err);
      toast({
        title: "Update Failed",
        description: "Failed to update parcel status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(null);
    }
  };
  
  // Calculate stats
  const totalParcels = parcels.length;
  const pendingParcels = parcels.filter((p) => p.status === "pending").length;
  const deliveredParcels = parcels.filter((p) => p.status === "delivered").length;
  const inProgressParcels = parcels.filter(
    (p) => !["pending", "delivered", "rejected"].includes(p.status)
  ).length;
  
  // Get pending parcels
  const pendingParcelsList = parcels
    .filter((p) => p.status === "pending")
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.name || "Admin"}!
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Parcels"
          value={totalParcels}
          icon={<Package className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="Pending Approval"
          value={pendingParcels}
          icon={<Clock className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="In Progress"
          value={inProgressParcels}
          icon={<Truck className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="Delivered"
          value={deliveredParcels}
          icon={<CheckCircle className="h-4 w-4 text-muted-foreground" />}
        />
      </div>
      
      {/* Pending Approvals */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Pending Approvals</CardTitle>
          <CardDescription>
            Parcels waiting for admin approval
          </CardDescription>
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
          ) : pendingParcelsList.length === 0 ? (
            <div className="flex flex-col items-center justify-center space-y-3 py-12">
              <CheckCircle className="h-12 w-12 text-muted-foreground/70" />
              <div className="text-center">
                <p className="text-lg font-medium">All caught up!</p>
                <p className="text-sm text-muted-foreground">
                  There are no parcels waiting for approval
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left text-xs font-medium text-muted-foreground">
                    <th className="px-2 py-3">Tracking #</th>
                    <th className="px-2 py-3">Created</th>
                    <th className="px-2 py-3">Recipient</th>
                    <th className="px-2 py-3">Status</th>
                    <th className="px-2 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingParcelsList.map((parcel) => (
                    <tr key={parcel.id} className="border-b">
                      <td className="whitespace-nowrap px-2 py-3 font-medium">
                        <Link
                          to={`/parcels/${parcel.id}`}
                          className="hover:underline text-primary"
                        >
                          {parcel.trackingNumber}
                        </Link>
                      </td>
                      <td className="whitespace-nowrap px-2 py-3 text-sm">
                        {formatDate(parcel.createdAt)}
                      </td>
                      <td className="px-2 py-3 text-sm">
                        {parcel.recipientName}
                      </td>
                      <td className="px-2 py-3">
                        <StatusBadge status={parcel.status} />
                      </td>
                      <td className="px-2 py-3">
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="default"
                            disabled={isUpdating === parcel.id}
                            onClick={() => handleUpdateStatus(parcel.id, "accepted")}
                          >
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={isUpdating === parcel.id}
                            onClick={() => handleUpdateStatus(parcel.id, "rejected")}
                            className="text-destructive hover:bg-destructive/10"
                          >
                            <XCircle className="mr-1 h-3 w-3" />
                            Reject
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              <div className="mt-4 flex justify-end">
                <Button asChild variant="outline" size="sm">
                  <Link to="/parcels">
                    View All Parcels
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Recent Activity</CardTitle>
          <CardDescription>
            Latest updates across the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Activity log visualization here - simplified for brevity */}
            <div className="relative pl-6 border-l">
              <div className="absolute w-3 h-3 bg-primary rounded-full -left-[7px] top-1"></div>
              <div>
                <p className="text-sm font-medium">
                  New parcel created by user
                </p>
                <p className="text-xs text-muted-foreground">
                  2 hours ago
                </p>
              </div>
            </div>
            <div className="relative pl-6 border-l">
              <div className="absolute w-3 h-3 bg-primary rounded-full -left-[7px] top-1"></div>
              <div>
                <p className="text-sm font-medium">
                  Parcel status updated to "delivered"
                </p>
                <p className="text-xs text-muted-foreground">
                  5 hours ago
                </p>
              </div>
            </div>
            <div className="relative pl-6 border-l">
              <div className="absolute w-3 h-3 bg-primary rounded-full -left-[7px] top-1"></div>
              <div>
                <p className="text-sm font-medium">
                  New user registered
                </p>
                <p className="text-xs text-muted-foreground">
                  1 day ago
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
