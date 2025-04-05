
import { cn } from "@/lib/utils";
import { getStatusColor, formatStatus, DeliveryStatus } from "@/models/parcel";

interface StatusBadgeProps {
  status: DeliveryStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const colorClasses = getStatusColor(status);
  
  return (
    <span 
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        colorClasses,
        className
      )}
    >
      {formatStatus(status)}
    </span>
  );
}
