import React, { useState } from 'react';
import { Vehicle } from '../types/Vehicle';
import VehicleList from './VehicleList';
import VehicleForm from './VehicleForm';
import VehicleDeleteModal from './VehicleDeleteModal';
import SlotManagement from './SlotManagement';

type ViewMode = 'list' | 'add' | 'edit' | 'slots';

const VehicleManagement: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleAddVehicle = () => {
    setSelectedVehicle(null);
    setViewMode('add');
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setViewMode('edit');
  };

  const handleDeleteVehicle = (vehicle: Vehicle) => {
    setVehicleToDelete(vehicle);
  };

  const handleManageSlots = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setViewMode('slots');
  };

  const handleBackToVehicles = () => {
    setViewMode('list');
    setSelectedVehicle(null);
  };

  const handleFormSubmit = (vehicle: Vehicle) => {
    setViewMode('list');
    setSelectedVehicle(null);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleFormCancel = () => {
    setViewMode('list');
    setSelectedVehicle(null);
  };

  const handleDeleteConfirm = () => {
    setVehicleToDelete(null);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleDeleteCancel = () => {
    setVehicleToDelete(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold text-gray-900">
          Gestión de Vehículos
        </h2>
        <p className="text-gray-600 mt-1">
          Administra todos los vehículos de tu flota de transporte de mascotas
        </p>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {viewMode === 'list' && (
          <VehicleList
            onAddVehicle={handleAddVehicle}
            onEditVehicle={handleEditVehicle}
            onDeleteVehicle={handleDeleteVehicle}
            onManageSlots={handleManageSlots}
            refreshTrigger={refreshTrigger}
          />
        )}

        {(viewMode === 'add' || viewMode === 'edit') && (
          <VehicleForm
            vehicle={selectedVehicle || undefined}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
          />
        )}

        {viewMode === 'slots' && selectedVehicle && (
          <SlotManagement
            vehicle={selectedVehicle}
            onBack={handleBackToVehicles}
          />
        )}
      </div>

      {/* Delete Modal */}
      {vehicleToDelete && (
        <VehicleDeleteModal
          vehicle={vehicleToDelete}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
      )}
    </div>
  );
};

export default VehicleManagement;