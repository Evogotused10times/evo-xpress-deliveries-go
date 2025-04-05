
import { Link } from "react-router-dom";
import { Package } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDate } from "@/lib/utils";
import type { Parcel } from "@/models/parcel";

interface ParcelCardProps {
  parcel: Parcel;
}

export function ParcelCard({ parcel }: ParcelCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            <span className="text-lg font-medium truncate">
              {parcel.trackingNumber}
            </span>
          </div>
          <StatusBadge status={parcel.status} />
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid grid-cols-1 gap-1 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Recipient:</span>
            <span className="font-medium">{parcel.recipientName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Delivery:</span>
            <span className="font-medium">
              {parcel.estimatedDelivery 
                ? formatDate(parcel.estimatedDelivery) 
                : "Not scheduled"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Price:</span>
            <span className="font-medium">₱{parcel.price.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button asChild variant="default" className="w-full">
          <Link to={`/parcels/${parcel.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
