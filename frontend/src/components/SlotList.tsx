import React, { useState, useEffect } from 'react';
import { Slot } from '../types/Slot';
import { slotService } from '../services/slotService';

interface SlotListProps {
  vehicleId: number;
  onAddSlot: () => void;
  onEditSlot: (slot: Slot) => void;
  onDeleteSlot: (slot: Slot) => void;
  refreshTrigger: number;
}

const SlotList: React.FC<SlotListProps> = ({
  vehicleId,
  onAddSlot,
  onEditSlot,
  onDeleteSlot,
  refreshTrigger
}) => {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSlots();
  }, [vehicleId, refreshTrigger]);

  const loadSlots = async () => {
    try {
      setLoading(true);
      setError(null);
      const slotData = await slotService.getSlotsByVehicle(vehicleId);
      setSlots(slotData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar plazas');
    } finally {
      setLoading(false);
    }
  };

  const formatDimensions = (slot: Slot) => {
    return `${slot.height}cm × ${slot.width}cm × ${slot.depth}cm`;
  };

  const getVolume = (slot: Slot) => {
    const volume = slot.height * slot.width * slot.depth;
    return volume >= 1000 ? `${(volume / 1000).toFixed(1)}L` : `${volume.toFixed(0)}cm³`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">
          Plazas ({slots.length})
        </h3>
        <button
          onClick={onAddSlot}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Añadir Plaza
        </button>
      </div>

      {/* Slot List */}
      {slots.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay plazas</h3>
          <p className="mt-1 text-sm text-gray-500">
            Comienza añadiendo la primera plaza para este vehículo.
          </p>
          <div className="mt-6">
            <button
              onClick={onAddSlot}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Añadir Plaza
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {slots.map((slot) => (
            <div key={slot.id} className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center">
                  <h4 className="text-lg font-medium text-gray-900">{slot.name}</h4>
                  <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    slot.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {slot.isActive ? 'Activa' : 'Inactiva'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onEditSlot(slot)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Editar plaza"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDeleteSlot(slot)}
                    className="text-red-600 hover:text-red-800"
                    title="Eliminar plaza"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4a1 1 0 011-1h4m0 0V1m0 2h4m0 0V1m0 2h4a1 1 0 011 1v4m0 0H1m3 0v4m0 0v4a1 1 0 001 1h4m0 0v3m0-3h4m0 0v3m0-3h4a1 1 0 001-1v-4m0 0H1" />
                  </svg>
                  <span>Dimensiones: {formatDimensions(slot)}</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <span>Volumen: {getVolume(slot)}</span>
                </div>
                
                <div className="text-xs text-gray-500">
                  Creada: {new Date(slot.createdAt).toLocaleDateString('es-ES')}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SlotList;