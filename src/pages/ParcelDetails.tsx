
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Package, MapPin, User, Phone, Mail, Truck, Calendar, ArrowRight, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { getParcelById, updateParcelStatus } from "@/services/parcel-service";
import { useAuth } from "@/providers/auth-provider";
import { useToast } from "@/hooks/use-toast";
import { formatDate, formatCurrency, getParcelProgress } from "@/lib/utils";
import type { Parcel, DeliveryStatus } from "@/models/parcel";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Progress } from "@/components/ui/progress";

const ParcelDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  
  const [parcel, setParcel] = useState<Parcel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showAcceptDialog, setShowAcceptDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  
  useEffect(() => {
    const fetchParcel = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await getParcelById(id);
        
        if (!data) {
          setError("Parcel not found");
          return;
        }
        
        setParcel(data);
      } catch (err) {
        console.error("Error fetching parcel:", err);
        setError("Failed to load parcel. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchParcel();
  }, [id]);
  
  const handleUpdateStatus = async (newStatus: DeliveryStatus) => {
    if (!id || !parcel) return;
    
    try {
      setIsUpdating(true);
      const updatedParcel = await updateParcelStatus(id, newStatus);
      setParcel(updatedParcel);
      
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
      setIsUpdating(false);
      setShowAcceptDialog(false);
      setShowRejectDialog(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-pulse">Loading parcel details...</div>
      </div>
    );
  }
  
  if (error || !parcel) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="rounded-md bg-destructive/10 p-6 text-center text-destructive">
          {error || "Parcel not found"}
        </div>
      </div>
    );
  }
  
  const progressValue = getParcelProgress(parcel.status);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="self-start -ml-2">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Parcels
        </Button>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Parcel Details</h1>
          <StatusBadge status={parcel.status} className="text-sm px-3 py-1" />
        </div>
      </div>
      
      {/* Tracking Number and Progress */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex items-center">
            <Package className="mr-2 h-5 w-5 text-primary" />
            Tracking No: {parcel.trackingNumber}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mt-2">
            <div className="flex justify-between text-sm mb-1">
              <span>Order Created</span>
              {parcel.status === 'delivered' ? (
                <span>Delivered</span>
              ) : (
                <span>Estimated Delivery</span>
              )}
            </div>
            <Progress value={progressValue} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>{formatDate(parcel.createdAt)}</span>
              <span>{parcel.estimatedDelivery ? formatDate(parcel.estimatedDelivery) : 'Not scheduled'}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Admin Actions */}
      {isAdmin && parcel.status === 'pending' && (
        <Card className="border-dashed border-primary/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Admin Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button 
                onClick={() => setShowAcceptDialog(true)}
                className="flex-1"
                disabled={isUpdating}
              >
                <Check className="mr-2 h-4 w-4" />
                Accept Parcel
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowRejectDialog(true)}
                className="flex-1"
                disabled={isUpdating}
              >
                <X className="mr-2 h-4 w-4" />
                Reject Parcel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* Sender Information */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <User className="mr-2 h-5 w-5 text-primary" />
              Sender Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <div className="font-medium">{parcel.senderName}</div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Phone className="mr-1 h-3 w-3" />
                {parcel.senderPhone}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Mail className="mr-1 h-3 w-3" />
                {parcel.senderEmail}
              </div>
            </div>
            
            <div className="pt-2 border-t">
              <div className="font-medium flex items-center">
                <MapPin className="mr-1 h-4 w-4 text-primary" />
                Pickup Address
              </div>
              <div className="text-sm text-muted-foreground">
                {parcel.pickupAddress.street}<br />
                {parcel.pickupAddress.city}, {parcel.pickupAddress.state} {parcel.pickupAddress.postalCode}<br />
                {parcel.pickupAddress.country}
                {parcel.pickupAddress.additionalInfo && (
                  <><br />{parcel.pickupAddress.additionalInfo}</>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Recipient Information */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <User className="mr-2 h-5 w-5 text-primary" />
              Recipient Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <div className="font-medium">{parcel.recipientName}</div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Phone className="mr-1 h-3 w-3" />
                {parcel.recipientPhone}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Mail className="mr-1 h-3 w-3" />
                {parcel.recipientEmail}
              </div>
            </div>
            
            <div className="pt-2 border-t">
              <div className="font-medium flex items-center">
                <MapPin className="mr-1 h-4 w-4 text-primary" />
                Delivery Address
              </div>
              <div className="text-sm text-muted-foreground">
                {parcel.deliveryAddress.street}<br />
                {parcel.deliveryAddress.city}, {parcel.deliveryAddress.state} {parcel.deliveryAddress.postalCode}<br />
                {parcel.deliveryAddress.country}
                {parcel.deliveryAddress.additionalInfo && (
                  <><br />{parcel.deliveryAddress.additionalInfo}</>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Parcel Details */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Package className="mr-2 h-5 w-5 text-primary" />
            Parcel Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-4">
            <div>
              <dt className="text-sm text-muted-foreground">Type</dt>
              <dd className="font-medium">
                {parcel.parcelType.split('_').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')}
              </dd>
            </div>
            
            <div>
              <dt className="text-sm text-muted-foreground">Weight</dt>
              <dd className="font-medium">{parcel.weight} kg</dd>
            </div>
            
            <div>
              <dt className="text-sm text-muted-foreground">Dimensions</dt>
              <dd className="font-medium">
                {parcel.dimensions.length} × {parcel.dimensions.width} × {parcel.dimensions.height} cm
              </dd>
            </div>
            
            <div>
              <dt className="text-sm text-muted-foreground">Price</dt>
              <dd className="font-medium">{formatCurrency(parcel.price)}</dd>
            </div>
            
            <div className="col-span-2 sm:col-span-4">
              <dt className="text-sm text-muted-foreground">Description</dt>
              <dd className="font-medium">{parcel.description}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
      
      {/* Parcel Timeline */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Calendar className="mr-2 h-5 w-5 text-primary" />
            Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="relative border-l border-muted ml-2">
            <li className="mb-4 ml-6">
              <span className="absolute flex items-center justify-center w-6 h-6 bg-primary rounded-full -left-3">
                <Check className="w-3 h-3 text-primary-foreground" />
              </span>
              <h3 className="flex items-center mb-1 font-medium">Order Created</h3>
              <time className="block text-xs text-muted-foreground">
                {formatDate(parcel.createdAt)}
              </time>
            </li>
            
            {parcel.status !== 'pending' && parcel.status !== 'rejected' && (
              <li className="mb-4 ml-6">
                <span className="absolute flex items-center justify-center w-6 h-6 bg-primary rounded-full -left-3">
                  <Check className="w-3 h-3 text-primary-foreground" />
                </span>
                <h3 className="mb-1 font-medium">Order Accepted</h3>
                <time className="block text-xs text-muted-foreground">
                  {formatDate(parcel.updatedAt)}
                </time>
              </li>
            )}
            
            {parcel.status === 'rejected' && (
              <li className="mb-4 ml-6">
                <span className="absolute flex items-center justify-center w-6 h-6 bg-destructive rounded-full -left-3">
                  <X className="w-3 h-3 text-destructive-foreground" />
                </span>
                <h3 className="mb-1 font-medium">Order Rejected</h3>
                <time className="block text-xs text-muted-foreground">
                  {formatDate(parcel.updatedAt)}
                </time>
              </li>
            )}
            
            {['picked_up', 'in_transit', 'out_for_delivery', 'delivered'].includes(parcel.status) && (
              <li className="mb-4 ml-6">
                <span className="absolute flex items-center justify-center w-6 h-6 bg-primary rounded-full -left-3">
                  <Check className="w-3 h-3 text-primary-foreground" />
                </span>
                <h3 className="mb-1 font-medium">Picked Up</h3>
                <time className="block text-xs text-muted-foreground">
                  {formatDate(parcel.updatedAt)}
                </time>
              </li>
            )}
            
            {['in_transit', 'out_for_delivery', 'delivered'].includes(parcel.status) && (
              <li className="mb-4 ml-6">
                <span className="absolute flex items-center justify-center w-6 h-6 bg-primary rounded-full -left-3">
                  <Check className="w-3 h-3 text-primary-foreground" />
                </span>
                <h3 className="mb-1 font-medium">In Transit</h3>
                <time className="block text-xs text-muted-foreground">
                  {formatDate(parcel.updatedAt)}
                </time>
              </li>
            )}
            
            {['out_for_delivery', 'delivered'].includes(parcel.status) && (
              <li className="mb-4 ml-6">
                <span className="absolute flex items-center justify-center w-6 h-6 bg-primary rounded-full -left-3">
                  <Check className="w-3 h-3 text-primary-foreground" />
                </span>
                <h3 className="mb-1 font-medium">Out for Delivery</h3>
                <time className="block text-xs text-muted-foreground">
                  {formatDate(parcel.updatedAt)}
                </time>
              </li>
            )}
            
            {parcel.status === 'delivered' && (
              <li className="ml-6">
                <span className="absolute flex items-center justify-center w-6 h-6 bg-primary rounded-full -left-3">
                  <Check className="w-3 h-3 text-primary-foreground" />
                </span>
                <h3 className="mb-1 font-medium">Delivered</h3>
                <time className="block text-xs text-muted-foreground">
                  {formatDate(parcel.deliveredAt || parcel.updatedAt)}
                </time>
              </li>
            )}
            
            {parcel.status !== 'delivered' && parcel.status !== 'rejected' && (
              <li className="ml-6">
                <span className="absolute flex items-center justify-center w-6 h-6 bg-muted rounded-full -left-3">
                  <Truck className="w-3 h-3 text-muted-foreground" />
                </span>
                <h3 className="mb-1 font-medium text-muted-foreground">
                  Estimated Delivery
                </h3>
                <time className="block text-xs text-muted-foreground">
                  {parcel.estimatedDelivery ? formatDate(parcel.estimatedDelivery) : 'Not scheduled'}
                </time>
              </li>
            )}
          </ol>
        </CardContent>
      </Card>
      
      {/* Accept Dialog */}
      <AlertDialog open={showAcceptDialog} onOpenChange={setShowAcceptDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Accept Parcel</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to accept this parcel for delivery?
              This will update the status to "accepted" and notify the customer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleUpdateStatus('accepted')}
              disabled={isUpdating}
              className="bg-primary"
            >
              {isUpdating ? "Processing..." : "Accept Parcel"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Reject Dialog */}
      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Parcel</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reject this parcel?
              This will update the status to "rejected" and notify the customer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleUpdateStatus('rejected')}
              disabled={isUpdating}
              className="bg-destructive"
            >
              {isUpdating ? "Processing..." : "Reject Parcel"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ParcelDetails;
