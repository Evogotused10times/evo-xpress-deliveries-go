
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/providers/auth-provider";
import { createParcel } from "@/services/parcel-service";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ParcelFormData, ParcelType } from "@/models/parcel";

const CreateParcel = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<ParcelFormData>();
  
  const onSubmit = async (data: ParcelFormData) => {
    if (!user) return;
    
    try {
      setIsSubmitting(true);
      
      // Create parcel
      const newParcel = await createParcel(user.id, data);
      
      toast({
        title: "Success",
        description: `Parcel created with tracking number: ${newParcel.trackingNumber}`,
      });
      
      navigate(`/parcels/${newParcel.id}`);
    } catch (error) {
      console.error("Error creating parcel:", error);
      toast({
        title: "Error",
        description: "Failed to create parcel. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleParcelTypeChange = (value: string) => {
    setValue('parcelType', value as ParcelType);
  };
  
  const parcelTypes: { value: ParcelType; label: string }[] = [
    { value: "document", label: "Document" },
    { value: "small_package", label: "Small Package" },
    { value: "medium_package", label: "Medium Package" },
    { value: "large_package", label: "Large Package" },
    { value: "fragile", label: "Fragile" },
    { value: "perishable", label: "Perishable" }
  ];
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Parcel</h1>
        <p className="text-muted-foreground">
          Fill out the form below to create a new parcel shipment
        </p>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Sender Information */}
        <Card>
          <CardHeader>
            <CardTitle>Sender Information</CardTitle>
            <CardDescription>
              Enter the details of the person sending the parcel
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="senderName">Full Name</Label>
                <Input
                  id="senderName"
                  placeholder="Juan Dela Cruz"
                  {...register("senderName", { required: "Sender name is required" })}
                />
                {errors.senderName && (
                  <p className="text-sm text-destructive">{errors.senderName.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="senderPhone">Phone Number</Label>
                <Input
                  id="senderPhone"
                  placeholder="+63 912 345 6789"
                  {...register("senderPhone", { required: "Sender phone is required" })}
                />
                {errors.senderPhone && (
                  <p className="text-sm text-destructive">{errors.senderPhone.message}</p>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="senderEmail">Email</Label>
              <Input
                id="senderEmail"
                type="email"
                placeholder="juan@example.com"
                {...register("senderEmail", {
                  required: "Sender email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.senderEmail && (
                <p className="text-sm text-destructive">{errors.senderEmail.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label>Pickup Address</Label>
              <Input
                placeholder="Street Address"
                {...register("pickupAddress.street", { required: "Street is required" })}
                className="mb-2"
              />
              {errors.pickupAddress?.street && (
                <p className="text-sm text-destructive -mt-2 mb-2">{errors.pickupAddress.street.message}</p>
              )}
              
              <div className="grid gap-2 sm:grid-cols-2">
                <div>
                  <Input
                    placeholder="City"
                    {...register("pickupAddress.city", { required: "City is required" })}
                  />
                  {errors.pickupAddress?.city && (
                    <p className="text-sm text-destructive">{errors.pickupAddress.city.message}</p>
                  )}
                </div>
                <div>
                  <Input
                    placeholder="State/Province"
                    {...register("pickupAddress.state", { required: "State is required" })}
                  />
                  {errors.pickupAddress?.state && (
                    <p className="text-sm text-destructive">{errors.pickupAddress.state.message}</p>
                  )}
                </div>
              </div>
              
              <div className="grid gap-2 sm:grid-cols-2 mt-2">
                <div>
                  <Input
                    placeholder="Postal Code"
                    {...register("pickupAddress.postalCode", { required: "Postal code is required" })}
                  />
                  {errors.pickupAddress?.postalCode && (
                    <p className="text-sm text-destructive">{errors.pickupAddress.postalCode.message}</p>
                  )}
                </div>
                <div>
                  <Input
                    placeholder="Country"
                    defaultValue="Philippines"
                    {...register("pickupAddress.country", { required: "Country is required" })}
                  />
                  {errors.pickupAddress?.country && (
                    <p className="text-sm text-destructive">{errors.pickupAddress.country.message}</p>
                  )}
                </div>
              </div>
              
              <Input
                placeholder="Additional Information (Optional)"
                {...register("pickupAddress.additionalInfo")}
                className="mt-2"
              />
            </div>
          </CardContent>
        </Card>
        
        {/* Recipient Information */}
        <Card>
          <CardHeader>
            <CardTitle>Recipient Information</CardTitle>
            <CardDescription>
              Enter the details of the person receiving the parcel
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="recipientName">Full Name</Label>
                <Input
                  id="recipientName"
                  placeholder="Maria Santos"
                  {...register("recipientName", { required: "Recipient name is required" })}
                />
                {errors.recipientName && (
                  <p className="text-sm text-destructive">{errors.recipientName.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="recipientPhone">Phone Number</Label>
                <Input
                  id="recipientPhone"
                  placeholder="+63 998 765 4321"
                  {...register("recipientPhone", { required: "Recipient phone is required" })}
                />
                {errors.recipientPhone && (
                  <p className="text-sm text-destructive">{errors.recipientPhone.message}</p>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="recipientEmail">Email</Label>
              <Input
                id="recipientEmail"
                type="email"
                placeholder="maria@example.com"
                {...register("recipientEmail", {
                  required: "Recipient email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.recipientEmail && (
                <p className="text-sm text-destructive">{errors.recipientEmail.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label>Delivery Address</Label>
              <Input
                placeholder="Street Address"
                {...register("deliveryAddress.street", { required: "Street is required" })}
                className="mb-2"
              />
              {errors.deliveryAddress?.street && (
                <p className="text-sm text-destructive -mt-2 mb-2">{errors.deliveryAddress.street.message}</p>
              )}
              
              <div className="grid gap-2 sm:grid-cols-2">
                <div>
                  <Input
                    placeholder="City"
                    {...register("deliveryAddress.city", { required: "City is required" })}
                  />
                  {errors.deliveryAddress?.city && (
                    <p className="text-sm text-destructive">{errors.deliveryAddress.city.message}</p>
                  )}
                </div>
                <div>
                  <Input
                    placeholder="State/Province"
                    {...register("deliveryAddress.state", { required: "State is required" })}
                  />
                  {errors.deliveryAddress?.state && (
                    <p className="text-sm text-destructive">{errors.deliveryAddress.state.message}</p>
                  )}
                </div>
              </div>
              
              <div className="grid gap-2 sm:grid-cols-2 mt-2">
                <div>
                  <Input
                    placeholder="Postal Code"
                    {...register("deliveryAddress.postalCode", { required: "Postal code is required" })}
                  />
                  {errors.deliveryAddress?.postalCode && (
                    <p className="text-sm text-destructive">{errors.deliveryAddress.postalCode.message}</p>
                  )}
                </div>
                <div>
                  <Input
                    placeholder="Country"
                    defaultValue="Philippines"
                    {...register("deliveryAddress.country", { required: "Country is required" })}
                  />
                  {errors.deliveryAddress?.country && (
                    <p className="text-sm text-destructive">{errors.deliveryAddress.country.message}</p>
                  )}
                </div>
              </div>
              
              <Input
                placeholder="Additional Information (Optional)"
                {...register("deliveryAddress.additionalInfo")}
                className="mt-2"
              />
            </div>
          </CardContent>
        </Card>
        
        {/* Parcel Details */}
        <Card>
          <CardHeader>
            <CardTitle>Parcel Details</CardTitle>
            <CardDescription>
              Provide information about the parcel you are sending
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="parcelType">Parcel Type</Label>
              <Select onValueChange={handleParcelTypeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select parcel type" />
                </SelectTrigger>
                <SelectContent>
                  {parcelTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input
                type="hidden"
                {...register("parcelType", { required: "Parcel type is required" })}
              />
              {errors.parcelType && (
                <p className="text-sm text-destructive">{errors.parcelType.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                min="0.1"
                placeholder="1.5"
                {...register("weight", {
                  required: "Weight is required",
                  valueAsNumber: true,
                  min: { value: 0.1, message: "Weight must be at least 0.1kg" },
                })}
              />
              {errors.weight && (
                <p className="text-sm text-destructive">{errors.weight.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label>Dimensions (cm)</Label>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Input
                    placeholder="Length"
                    type="number"
                    min="1"
                    step="1"
                    {...register("dimensions.length", {
                      required: "Length is required",
                      valueAsNumber: true,
                      min: { value: 1, message: "Must be at least 1cm" },
                    })}
                  />
                  {errors.dimensions?.length && (
                    <p className="text-sm text-destructive">{errors.dimensions.length.message}</p>
                  )}
                </div>
                <div>
                  <Input
                    placeholder="Width"
                    type="number"
                    min="1"
                    step="1"
                    {...register("dimensions.width", {
                      required: "Width is required",
                      valueAsNumber: true,
                      min: { value: 1, message: "Must be at least 1cm" },
                    })}
                  />
                  {errors.dimensions?.width && (
                    <p className="text-sm text-destructive">{errors.dimensions.width.message}</p>
                  )}
                </div>
                <div>
                  <Input
                    placeholder="Height"
                    type="number"
                    min="1"
                    step="1"
                    {...register("dimensions.height", {
                      required: "Height is required",
                      valueAsNumber: true,
                      min: { value: 1, message: "Must be at least 1cm" },
                    })}
                  />
                  {errors.dimensions?.height && (
                    <p className="text-sm text-destructive">{errors.dimensions.height.message}</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description of Contents</Label>
              <Textarea
                id="description"
                placeholder="Briefly describe the contents of your parcel"
                rows={3}
                {...register("description", { required: "Description is required" })}
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description.message}</p>
              )}
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating Parcel..." : "Create Parcel"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateParcel;
