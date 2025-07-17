export interface Slot {
  id: number;
  name: string;
  height: number;
  width: number;
  depth: number;
  isActive: boolean;
  vehicleId: number;
  createdAt: string;
  updatedAt: string;
}

export interface SlotFormData {
  name: string;
  height: number;
  width: number;
  depth: number;
  isActive: boolean;
  vehicleId: number;
}