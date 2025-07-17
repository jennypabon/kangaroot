export interface Vehicle {
  id: number;
  licensePlate: string;
  name: string;
  companyId: number;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface VehicleFormData {
  licensePlate: string;
  name: string;
}