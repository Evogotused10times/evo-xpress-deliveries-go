
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, PackagePlus, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ParcelCard } from "@/components/parcel/parcel-card";
import { getUserParcels } from "@/services/parcel-service";
import { useAuth } from "@/providers/auth-provider";
import type { Parcel, DeliveryStatus } from "@/models/parcel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Parcels = () => {
  const { user } = useAuth();
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [filteredParcels, setFilteredParcels] = useState<Parcel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<DeliveryStatus | "all">("all");
  
  useEffect(() => {
    const fetchParcels = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const userParcels = await getUserParcels(user.id);
        setParcels(userParcels);
        setFilteredParcels(userParcels);
      } catch (err) {
        console.error("Error fetching parcels:", err);
        setError("Failed to load parcels. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchParcels();
  }, [user]);
  
  useEffect(() => {
    // Apply filters when parcels, searchTerm, or statusFilter changes
    let results = [...parcels];
    
    // Apply status filter
    if (statusFilter !== "all") {
      results = results.filter(parcel => parcel.status === statusFilter);
    }
    
    // Apply search term
    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      results = results.filter(
        parcel =>
          parcel.trackingNumber.toLowerCase().includes(lowercasedTerm) ||
          parcel.recipientName.toLowerCase().includes(lowercasedTerm) ||
          parcel.recipientEmail.toLowerCase().includes(lowercasedTerm) ||
          parcel.deliveryAddress.city.toLowerCase().includes(lowercasedTerm)
      );
    }
    
    setFilteredParcels(results);
  }, [parcels, searchTerm, statusFilter]);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">My Parcels</h1>
        <p className="text-muted-foreground">
          Manage and track all your parcels
        </p>
      </div>
      
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search parcels..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as DeliveryStatus | "all")}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="picked_up">Picked Up</SelectItem>
              <SelectItem value="in_transit">In Transit</SelectItem>
              <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button asChild>
          <Link to="/parcels/create">
            <PackagePlus className="mr-2 h-4 w-4" />
            Create Parcel
          </Link>
        </Button>
      </div>
      
      {loading ? (
        <div className="flex justify-center p-8">
          <div className="animate-pulse">Loading parcels...</div>
        </div>
      ) : error ? (
        <div className="rounded-md bg-destructive/10 p-6 text-center text-destructive">
          {error}
        </div>
      ) : filteredParcels.length === 0 ? (
        <div className="flex flex-col items-center justify-center space-y-4 rounded-lg border border-dashed p-8 text-center">
          {parcels.length === 0 ? (
            <>
              <Package className="h-12 w-12 text-muted-foreground/70" />
              <div>
                <p className="text-lg font-medium">No parcels found</p>
                <p className="text-sm text-muted-foreground">
                  You haven't created any parcels yet
                </p>
              </div>
              <Button asChild>
                <Link to="/parcels/create">
                  <PackagePlus className="mr-2 h-4 w-4" />
                  Create Your First Parcel
                </Link>
              </Button>
            </>
          ) : (
            <>
              <Filter className="h-12 w-12 text-muted-foreground/70" />
              <div>
                <p className="text-lg font-medium">No matching parcels</p>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search or filter criteria
                </p>
              </div>
              <Button variant="outline" onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
              }}>
                Clear Filters
              </Button>
            </>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredParcels.map((parcel) => (
            <ParcelCard key={parcel.id} parcel={parcel} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Parcels;
