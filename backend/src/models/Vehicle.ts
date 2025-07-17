export interface Vehicle {
  id?: number;
  license_plate: string;
  name: string;
  company_id: number;
  created_at?: Date;
  updated_at?: Date;
  is_active?: boolean;
}

export interface VehicleRegistrationData {
  licensePlate: string;
  name: string;
}

export interface VehicleUpdateData {
  licensePlate?: string;
  name?: string;
}