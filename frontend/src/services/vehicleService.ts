import { Vehicle, VehicleFormData } from '../types/Vehicle';

const API_BASE_URL = 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('kangaroute_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

export const vehicleService = {
  // Get all vehicles
  async getVehicles(): Promise<Vehicle[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/vehicles`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Error al obtener vehículos');
      }

      const data = await response.json();
      return data.vehicles;
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      throw error;
    }
  },

  // Get a specific vehicle
  async getVehicle(id: number): Promise<Vehicle> {
    try {
      const response = await fetch(`${API_BASE_URL}/vehicles/${id}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Error al obtener vehículo');
      }

      const data = await response.json();
      return data.vehicle;
    } catch (error) {
      console.error('Error fetching vehicle:', error);
      throw error;
    }
  },

  // Create a new vehicle
  async createVehicle(vehicleData: VehicleFormData): Promise<Vehicle> {
    try {
      const response = await fetch(`${API_BASE_URL}/vehicles`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(vehicleData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear vehículo');
      }

      const data = await response.json();
      return data.vehicle;
    } catch (error) {
      console.error('Error creating vehicle:', error);
      throw error;
    }
  },

  // Update a vehicle
  async updateVehicle(id: number, vehicleData: Partial<VehicleFormData>): Promise<Vehicle> {
    try {
      const response = await fetch(`${API_BASE_URL}/vehicles/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(vehicleData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar vehículo');
      }

      const data = await response.json();
      return data.vehicle;
    } catch (error) {
      console.error('Error updating vehicle:', error);
      throw error;
    }
  },

  // Delete a vehicle
  async deleteVehicle(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/vehicles/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al eliminar vehículo');
      }
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      throw error;
    }
  },
};