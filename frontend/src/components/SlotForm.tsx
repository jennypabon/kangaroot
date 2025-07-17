import React, { useState, useEffect } from 'react';
import { Slot, SlotFormData } from '../types/Slot';
import { slotService } from '../services/slotService';

interface SlotFormProps {
  vehicleId: number;
  slot?: Slot;
  onSubmit: (slot: Slot) => void;
  onCancel: () => void;
}

const SlotForm: React.FC<SlotFormProps> = ({ vehicleId, slot, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<SlotFormData>({
    name: '',
    height: 0,
    width: 0,
    depth: 0,
    isActive: true,
    vehicleId: vehicleId,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slot) {
      setFormData({
        name: slot.name,
        height: slot.height,
        width: slot.width,
        depth: slot.depth,
        isActive: slot.isActive,
        vehicleId: slot.vehicleId,
      });
    }
  }, [slot]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate form data
      if (!formData.name.trim()) {
        setError('El nombre de la plaza es obligatorio');
        setLoading(false);
        return;
      }

      if (formData.height <= 0 || formData.width <= 0 || formData.depth <= 0) {
        setError('Todas las dimensiones deben ser mayores a 0');
        setLoading(false);
        return;
      }

      // Clean data
      const cleanData = {
        ...formData,
        name: formData.name.trim(),
        height: Number(formData.height),
        width: Number(formData.width),
        depth: Number(formData.depth),
      };

      let result: Slot;
      if (slot) {
        // Update existing slot
        result = await slotService.updateSlot(slot.id, cleanData);
      } else {
        // Create new slot
        result = await slotService.createSlot(cleanData);
      }

      onSubmit(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar plaza');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const getVolume = () => {
    const volume = formData.height * formData.width * formData.depth;
    return volume >= 1000 ? `${(volume / 1000).toFixed(1)}L` : `${volume.toFixed(0)}cm³`;
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          {slot ? 'Editar Plaza' : 'Añadir Plaza'}
        </h2>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
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
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nombre de la Plaza <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ej: Plaza A1"
              maxLength={255}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="height" className="block text-sm font-medium text-gray-700">
                Alto (cm) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="height"
                name="height"
                value={formData.height || ''}
                onChange={handleChange}
                placeholder="0"
                min="0.01"
                step="0.01"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="width" className="block text-sm font-medium text-gray-700">
                Ancho (cm) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="width"
                name="width"
                value={formData.width || ''}
                onChange={handleChange}
                placeholder="0"
                min="0.01"
                step="0.01"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="depth" className="block text-sm font-medium text-gray-700">
                Profundo (cm) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="depth"
                name="depth"
                value={formData.depth || ''}
                onChange={handleChange}
                placeholder="0"
                min="0.01"
                step="0.01"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          {formData.height > 0 && formData.width > 0 && formData.depth > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm text-blue-800">
                  Volumen calculado: <strong>{getVolume()}</strong>
                </span>
              </div>
            </div>
          )}

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
              Plaza activa (disponible para uso)
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Guardando...
                </div>
              ) : (
                slot ? 'Actualizar' : 'Crear'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SlotForm;