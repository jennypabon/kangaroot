import React, { useState } from 'react';
import { Slot } from '../types/Slot';
import { Vehicle } from '../types/Vehicle';
import SlotList from './SlotList';
import SlotForm from './SlotForm';
import SlotDeleteModal from './SlotDeleteModal';

interface SlotManagementProps {
  vehicle: Vehicle;
  onBack: () => void;
}

type ViewMode = 'list' | 'add' | 'edit';

const SlotManagement: React.FC<SlotManagementProps> = ({ vehicle, onBack }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [slotToDelete, setSlotToDelete] = useState<Slot | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleAddSlot = () => {
    setSelectedSlot(null);
    setViewMode('add');
  };

  const handleEditSlot = (slot: Slot) => {
    setSelectedSlot(slot);
    setViewMode('edit');
  };

  const handleDeleteSlot = (slot: Slot) => {
    setSlotToDelete(slot);
  };

  const handleFormSubmit = (slot: Slot) => {
    setViewMode('list');
    setSelectedSlot(null);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleFormCancel = () => {
    setViewMode('list');
    setSelectedSlot(null);
  };

  const handleDeleteConfirm = () => {
    setSlotToDelete(null);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleDeleteCancel = () => {
    setSlotToDelete(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <button
              onClick={onBack}
              className="flex items-center text-blue-600 hover:text-blue-800 mb-2"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Volver a Vehículos
            </button>
            <h2 className="text-2xl font-bold text-gray-900">
              Gestión de Plazas
            </h2>
            <p className="text-gray-600 mt-1">
              Vehículo: <span className="font-medium">{vehicle.name}</span> ({vehicle.licensePlate})
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="bg-blue-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {viewMode === 'list' && (
          <SlotList
            vehicleId={vehicle.id}
            onAddSlot={handleAddSlot}
            onEditSlot={handleEditSlot}
            onDeleteSlot={handleDeleteSlot}
            refreshTrigger={refreshTrigger}
          />
        )}

        {(viewMode === 'add' || viewMode === 'edit') && (
          <SlotForm
            vehicleId={vehicle.id}
            slot={selectedSlot || undefined}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
          />
        )}
      </div>

      {/* Delete Modal */}
      {slotToDelete && (
        <SlotDeleteModal
          slot={slotToDelete}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
      )}
    </div>
  );
};

export default SlotManagement;