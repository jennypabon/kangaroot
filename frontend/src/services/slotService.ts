import { Slot, SlotFormData } from '../types/Slot';

const API_BASE_URL = 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('kangaroute_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

export const slotService = {
  // Get all slots for a vehicle
  async getSlotsByVehicle(vehicleId: number): Promise<Slot[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/slots/vehicle/${vehicleId}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Error al obtener plazas');
      }

      const data = await response.json();
      return data.slots;
    } catch (error) {
      console.error('Error fetching slots:', error);
      throw error;
    }
  },

  // Get a specific slot
  async getSlot(id: number): Promise<Slot> {
    try {
      const response = await fetch(`${API_BASE_URL}/slots/${id}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Error al obtener plaza');
      }

      const data = await response.json();
      return data.slot;
    } catch (error) {
      console.error('Error fetching slot:', error);
      throw error;
    }
  },

  // Create a new slot
  async createSlot(slotData: SlotFormData): Promise<Slot> {
    try {
      const response = await fetch(`${API_BASE_URL}/slots`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(slotData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear plaza');
      }

      const data = await response.json();
      return data.slot;
    } catch (error) {
      console.error('Error creating slot:', error);
      throw error;
    }
  },

  // Update a slot
  async updateSlot(id: number, slotData: Partial<SlotFormData>): Promise<Slot> {
    try {
      const response = await fetch(`${API_BASE_URL}/slots/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(slotData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar plaza');
      }

      const data = await response.json();
      return data.slot;
    } catch (error) {
      console.error('Error updating slot:', error);
      throw error;
    }
  },

  // Delete a slot
  async deleteSlot(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/slots/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al eliminar plaza');
      }
    } catch (error) {
      console.error('Error deleting slot:', error);
      throw error;
    }
  },
};