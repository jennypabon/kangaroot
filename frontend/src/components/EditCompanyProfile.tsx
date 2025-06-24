import React, { useState, useEffect } from 'react';

interface CompanyData {
  companyName: string;
  adminUsername: string;
  email: string;
  phone: string;
  address: string;
  taxId: string;
  website?: string;
}

interface EditCompanyProfileProps {
  onCancel: () => void;
  onUpdateSuccess: (updatedCompany: any) => void;
}

const EditCompanyProfile: React.FC<EditCompanyProfileProps> = ({ onCancel, onUpdateSuccess }) => {
  const [formData, setFormData] = useState<CompanyData>({
    companyName: '',
    adminUsername: '',
    email: '',
    phone: '',
    address: '',
    taxId: '',
    website: ''
  });

  const [errors, setErrors] = useState<Partial<CompanyData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Load current company data from localStorage
    const storedCompany = localStorage.getItem('kangaroute_company');
    if (storedCompany) {
      const company = JSON.parse(storedCompany);
      setFormData({
        companyName: company.companyName || '',
        adminUsername: company.adminUsername || '',
        email: company.email || '',
        phone: company.phone || '',
        address: company.address || '',
        taxId: company.taxId || '',
        website: company.website || ''
      });
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof CompanyData]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Clear success message when editing
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CompanyData> = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'El nombre de la empresa es obligatorio';
    }

    if (!formData.adminUsername.trim()) {
      newErrors.adminUsername = 'El usuario administrador es obligatorio';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El correo electrónico no es válido';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es obligatorio';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'La dirección es obligatoria';
    }

    if (!formData.taxId.trim()) {
      newErrors.taxId = 'El número de identificación fiscal es obligatorio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsLoading(true);
      setSuccessMessage('');

      try {
        const token = localStorage.getItem('kangaroute_token');
        const currentCompany = JSON.parse(localStorage.getItem('kangaroute_company') || '{}');
        
        const response = await fetch(`http://localhost:5000/api/companies/${currentCompany.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (data.success) {
          setSuccessMessage('¡Datos actualizados exitosamente!');
          
          // Update localStorage with new company data
          const updatedCompany = { ...currentCompany, ...data.data.company };
          localStorage.setItem('kangaroute_company', JSON.stringify(updatedCompany));
          
          // Call callback to update parent component
          onUpdateSuccess(updatedCompany);
          
          // Auto close after 2 seconds
          setTimeout(() => {
            onCancel();
          }, 2000);
        } else {
          alert(data.message || 'Error al actualizar los datos');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error de conexión con el servidor');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Editar Perfil de Empresa
      </h2>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  {successMessage}
                </p>
              </div>
            </div>
          </div>
        )}
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          
          {/* Company Name */}
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
              Nombre de la Empresa *
            </label>
            <div className="mt-1">
              <input
                id="companyName"
                name="companyName"
                type="text"
                value={formData.companyName}
                onChange={handleInputChange}
                className={`appearance-none block w-full px-3 py-2 border ${
                  errors.companyName ? 'border-red-300' : 'border-gray-300'
                } rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                placeholder="Ej: Transportes Mascotas SL"
              />
              {errors.companyName && (
                <p className="mt-2 text-sm text-red-600">{errors.companyName}</p>
              )}
            </div>
          </div>

          {/* Admin Username */}
          <div>
            <label htmlFor="adminUsername" className="block text-sm font-medium text-gray-700">
              Usuario Administrador *
            </label>
            <div className="mt-1">
              <input
                id="adminUsername"
                name="adminUsername"
                type="text"
                value={formData.adminUsername}
                onChange={handleInputChange}
                className={`appearance-none block w-full px-3 py-2 border ${
                  errors.adminUsername ? 'border-red-300' : 'border-gray-300'
                } rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                placeholder="admin"
              />
              {errors.adminUsername && (
                <p className="mt-2 text-sm text-red-600">{errors.adminUsername}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Correo Electrónico *
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`appearance-none block w-full px-3 py-2 border ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                } rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                placeholder="empresa@ejemplo.com"
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-600">{errors.email}</p>
              )}
            </div>
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Teléfono de Contacto *
            </label>
            <div className="mt-1">
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                className={`appearance-none block w-full px-3 py-2 border ${
                  errors.phone ? 'border-red-300' : 'border-gray-300'
                } rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                placeholder="+34 123 456 789"
              />
              {errors.phone && (
                <p className="mt-2 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>
          </div>

          {/* Address */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Dirección Completa *
            </label>
            <div className="mt-1">
              <input
                id="address"
                name="address"
                type="text"
                value={formData.address}
                onChange={handleInputChange}
                className={`appearance-none block w-full px-3 py-2 border ${
                  errors.address ? 'border-red-300' : 'border-gray-300'
                } rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                placeholder="Calle, número, ciudad, código postal"
              />
              {errors.address && (
                <p className="mt-2 text-sm text-red-600">{errors.address}</p>
              )}
            </div>
          </div>

          {/* Tax ID */}
          <div>
            <label htmlFor="taxId" className="block text-sm font-medium text-gray-700">
              Número de Identificación Fiscal *
            </label>
            <div className="mt-1">
              <input
                id="taxId"
                name="taxId"
                type="text"
                value={formData.taxId}
                onChange={handleInputChange}
                className={`appearance-none block w-full px-3 py-2 border ${
                  errors.taxId ? 'border-red-300' : 'border-gray-300'
                } rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                placeholder="CIF/NIF"
              />
              {errors.taxId && (
                <p className="mt-2 text-sm text-red-600">{errors.taxId}</p>
              )}
            </div>
          </div>

          {/* Website (Optional) */}
          <div>
            <label htmlFor="website" className="block text-sm font-medium text-gray-700">
              Sitio Web (Opcional)
            </label>
            <div className="mt-1">
              <input
                id="website"
                name="website"
                type="url"
                value={formData.website}
                onChange={handleInputChange}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="https://www.tuempresa.com"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Actualizando...' : 'Guardar Cambios'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md font-medium transition duration-200"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCompanyProfile;