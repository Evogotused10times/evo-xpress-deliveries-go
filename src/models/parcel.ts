
export type DeliveryStatus =
  | "pending"
  | "accepted"
  | "picked_up"
  | "in_transit"
  | "out_for_delivery"
  | "delivered"
  | "failed"
  | "rejected";

export type ParcelType = 
  | "document"
  | "small_package"
  | "medium_package"
  | "large_package"
  | "fragile"
  | "perishable";

export type DeliveryAddress = {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  additionalInfo?: string;
};

export type Parcel = {
  id: string;
  userId: string;
  trackingNumber: string;
  senderName: string;
  senderPhone: string;
  senderEmail: string;
  recipientName: string;
  recipientPhone: string;
  recipientEmail: string;
  pickupAddress: DeliveryAddress;
  deliveryAddress: DeliveryAddress;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  parcelType: ParcelType;
  description: string;
  status: DeliveryStatus;
  price: number;
  estimatedDelivery: Date | null;
  createdAt: Date;
  updatedAt: Date;
  deliveredAt: Date | null;
};

export type ParcelFormData = Omit<
  Parcel, 
  "id" | "userId" | "trackingNumber" | "status" | 
  "price" | "estimatedDelivery" | "createdAt" | 
  "updatedAt" | "deliveredAt"
>;

export const getStatusColor = (status: DeliveryStatus) => {
  switch (status) {
    case "pending":
      return "bg-yellow-900/40 text-yellow-300 border border-yellow-500/50 dark:bg-yellow-900/30 dark:text-yellow-300";
    case "accepted":
      return "bg-blue-900/40 text-blue-300 border border-blue-500/50 dark:bg-blue-900/30 dark:text-blue-300";
    case "picked_up":
      return "bg-indigo-900/40 text-indigo-300 border border-indigo-500/50 dark:bg-indigo-900/30 dark:text-indigo-300";
    case "in_transit":
      return "bg-purple-900/40 text-purple-300 border border-purple-500/50 dark:bg-purple-900/30 dark:text-purple-300";
    case "out_for_delivery":
      return "bg-cyan-900/40 text-cyan-300 border border-cyan-500/50 dark:bg-cyan-900/30 dark:text-cyan-300";
    case "delivered":
      return "bg-green-900/40 text-green-300 border border-green-500/50 dark:bg-green-900/30 dark:text-green-300";
    case "failed":
      return "bg-red-900/40 text-red-300 border border-red-500/50 dark:bg-red-900/30 dark:text-red-300";
    case "rejected":
      return "bg-gray-900/40 text-gray-300 border border-gray-500/50 dark:bg-gray-900/30 dark:text-gray-300";
    default:
      return "bg-gray-900/40 text-gray-300 border border-gray-500/50 dark:bg-gray-900/30 dark:text-gray-300";
  }
};

export const formatStatus = (status: DeliveryStatus) => {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
