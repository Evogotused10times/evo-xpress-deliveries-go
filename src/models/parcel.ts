
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
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "accepted":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case "picked_up":
      return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300";
    case "in_transit":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
    case "out_for_delivery":
      return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300";
    case "delivered":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "failed":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    case "rejected":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  }
};

export const formatStatus = (status: DeliveryStatus) => {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
