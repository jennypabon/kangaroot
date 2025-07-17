export interface Slot {
  id?: number;
  name: string;
  height: number;
  width: number;
  depth: number;
  is_active: boolean;
  vehicle_id: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface SlotRegistrationData {
  name: string;
  height: number;
  width: number;
  depth: number;
  isActive: boolean;
  vehicleId: number;
}

export interface SlotUpdateData {
  name?: string;
  height?: number;
  width?: number;
  depth?: number;
  isActive?: boolean;
}