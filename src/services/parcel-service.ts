import { DeliveryAddress, DeliveryStatus, Parcel, ParcelFormData, ParcelType } from "@/models/parcel";

// Mock database
let parcels: Parcel[] = [];

// Generate a random tracking number
const generateTrackingNumber = () => {
  const prefix = "EVO";
  const randomNum = Math.floor(Math.random() * 10000000).toString().padStart(7, '0');
  const suffix = "PH";
  return `${prefix}${randomNum}${suffix}`;
};

// Calculate price based on weight and dimensions
const calculatePrice = (weight: number, dimensions: { length: number; width: number; height: number }) => {
  const volume = dimensions.length * dimensions.width * dimensions.height;
  const basePrice = 100; // Base price in PHP
  const weightPrice = weight * 10; // 10 PHP per kg
  const volumePrice = volume * 0.001; // 0.001 PHP per cubic cm
  return Math.round(basePrice + weightPrice + volumePrice);
};

// Calculate estimated delivery date (2-5 days from now)
const calculateEstimatedDelivery = () => {
  const today = new Date();
  const daysToAdd = 2 + Math.floor(Math.random() * 4); // 2-5 days
  const estimatedDate = new Date(today);
  estimatedDate.setDate(today.getDate() + daysToAdd);
  return estimatedDate;
};

// Get all parcels for a user
export const getUserParcels = async (userId: string): Promise<Parcel[]> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  if (!parcels.length) {
    // Generate some mock data if empty
    generateMockParcels(userId);
  }
  
  return parcels.filter(parcel => parcel.userId === userId);
};

// Get all parcels for admin
export const getAllParcels = async (): Promise<Parcel[]> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  if (!parcels.length) {
    // Generate some mock data if empty
    generateMockParcels("admin-123");
  }
  
  return parcels;
};

// Get a parcel by ID
export const getParcelById = async (id: string): Promise<Parcel | undefined> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  return parcels.find(parcel => parcel.id === id);
};

// Create a new parcel
export const createParcel = async (userId: string, parcelData: ParcelFormData): Promise<Parcel> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  const trackingNumber = generateTrackingNumber();
  const price = calculatePrice(parcelData.weight, parcelData.dimensions);
  const estimatedDelivery = calculateEstimatedDelivery();
  const now = new Date();
  
  const newParcel: Parcel = {
    ...parcelData,
    id: `parcel-${Math.random().toString(36).substring(2, 9)}`,
    userId,
    trackingNumber,
    status: "pending",
    price,
    estimatedDelivery,
    createdAt: now,
    updatedAt: now,
    deliveredAt: null
  };
  
  parcels.push(newParcel);
  return newParcel;
};

// Update parcel status
export const updateParcelStatus = async (id: string, status: DeliveryStatus): Promise<Parcel> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  const parcelIndex = parcels.findIndex(parcel => parcel.id === id);
  if (parcelIndex === -1) {
    throw new Error("Parcel not found");
  }
  
  const now = new Date();
  const updatedParcel = {
    ...parcels[parcelIndex],
    status,
    updatedAt: now,
    deliveredAt: status === "delivered" ? now : parcels[parcelIndex].deliveredAt
  };
  
  parcels[parcelIndex] = updatedParcel;
  return updatedParcel;
};

// Generate mock data
const generateMockParcels = (userId: string) => {
  const mockAddresses = [
    {
      street: "123 Rizal Ave",
      city: "Manila",
      state: "Metro Manila",
      postalCode: "1000",
      country: "Philippines"
    },
    {
      street: "456 Ayala Blvd",
      city: "Makati",
      state: "Metro Manila",
      postalCode: "1200",
      country: "Philippines"
    },
    {
      street: "789 Marcos Highway",
      city: "Quezon City",
      state: "Metro Manila",
      postalCode: "1110",
      country: "Philippines"
    }
  ];
  
  const statuses: DeliveryStatus[] = [
    "pending",
    "accepted",
    "picked_up",
    "in_transit",
    "out_for_delivery",
    "delivered"
  ];
  
  const parcelTypes: ParcelType[] = [
    "document",
    "small_package",
    "medium_package",
    "large_package"
  ];
  
  // Create 5 mock parcels
  for (let i = 0; i < 5; i++) {
    const now = new Date();
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const weight = 0.5 + Math.random() * 10; // 0.5 to 10.5 kg
    const dimensions = {
      length: 10 + Math.floor(Math.random() * 40), // 10-50 cm
      width: 10 + Math.floor(Math.random() * 30), // 10-40 cm
      height: 5 + Math.floor(Math.random() * 20) // 5-25 cm
    };
    
    const mockParcel: Parcel = {
      id: `parcel-${Math.random().toString(36).substring(2, 9)}`,
      userId,
      trackingNumber: generateTrackingNumber(),
      senderName: "John Doe",
      senderPhone: "+63 912 345 6789",
      senderEmail: "john@example.com",
      recipientName: "Jane Smith",
      recipientPhone: "+63 998 765 4321",
      recipientEmail: "jane@example.com",
      pickupAddress: mockAddresses[i % mockAddresses.length],
      deliveryAddress: mockAddresses[(i + 1) % mockAddresses.length],
      weight,
      dimensions,
      parcelType: parcelTypes[i % parcelTypes.length],
      description: `Test parcel ${i + 1}`,
      status,
      price: calculatePrice(weight, dimensions),
      estimatedDelivery: calculateEstimatedDelivery(),
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * i), // i days ago
      updatedAt: new Date(now.getTime() - 1000 * 60 * 60 * 12 * i), // i/2 days ago
      deliveredAt: status === "delivered" ? new Date() : null
    };
    
    parcels.push(mockParcel);
  }
};
