import React, { useState, useEffect } from 'react';
import EditCompanyProfile from './EditCompanyProfile';

interface Company {
  id: number;
  companyName: string;
  adminUsername: string;
  email: string;
  phone: string;
  address: string;
  taxId: string;
  website?: string;
}

type DashboardSection = 'main' | 'vehicles' | 'routes' | 'bookings' | 'profile';

const Dashboard: React.FC = () => {
  const [company, setCompany] = useState<Company | null>(null);
  const [currentSection, setCurrentSection] = useState<DashboardSection>('main');

  useEffect(() => {
    // Get company data from localStorage
    const storedCompany = localStorage.getItem('kangaroute_company');
    if (storedCompany) {
      setCompany(JSON.parse(storedCompany));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('kangaroute_token');
    localStorage.removeItem('kangaroute_company');
    // Reload page to go back to auth
    window.location.reload();
  };

  const handleProfileUpdate = (updatedCompany: Company) => {
    setCompany(updatedCompany);
  };

  const navigateToSection = (section: DashboardSection) => {
    setCurrentSection(section);
  };

  if (!company) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-gray-900">
                {company.companyName}
              </h1>
              <button
                onClick={() => navigateToSection('profile')}
                className="ml-3 p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition duration-200"
                title="Editar perfil de empresa"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <span className="ml-4 px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                Panel de Control
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Bienvenido, {company.adminUsername}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-200"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Breadcrumb */}
        {currentSection !== 'main' && (
          <nav className="mb-6">
            <button
              onClick={() => navigateToSection('main')}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              ← Volver al Panel Principal
            </button>
          </nav>
        )}

        {/* Main Dashboard Content */}
        {currentSection === 'main' && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Panel Principal
              </h2>
              <p className="text-gray-600">
                Gestiona todos los aspectos de tu empresa de transporte de mascotas
              </p>
            </div>

            {/* Main Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Vehicles Card */}
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-200">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 011 1v2a1 1 0 01-1 1h-1v10a2 2 0 01-2 2H6a2 2 0 01-2-2V8H3a1 1 0 01-1-1V5a1 1 0 011-1h4z" />
                    </svg>
                  </div>
                  <h3 className="ml-4 text-lg font-semibold text-gray-900">Vehículos</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Gestiona tu flota de vehículos para el transporte de mascotas
                </p>
                <button
                  onClick={() => navigateToSection('vehicles')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium transition duration-200"
                >
                  Gestionar Vehículos
                </button>
              </div>

              {/* Routes Card */}
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-200">
                <div className="flex items-center mb-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                  </div>
                  <h3 className="ml-4 text-lg font-semibold text-gray-900">Rutas</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Planifica y optimiza las rutas de transporte de mascotas
                </p>
                <button
                  onClick={() => navigateToSection('routes')}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md font-medium transition duration-200"
                >
                  Gestionar Rutas
                </button>
              </div>

              {/* Bookings Card */}
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-200">
                <div className="flex items-center mb-4">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2h3z" />
                    </svg>
                  </div>
                  <h3 className="ml-4 text-lg font-semibold text-gray-900">Reservas</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Administra las reservas y citas de transporte
                </p>
                <button
                  onClick={() => navigateToSection('bookings')}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md font-medium transition duration-200"
                >
                  Gestionar Reservas
                </button>
              </div>
            </div>

            {/* Company Info */}
            <div className="mt-8 bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Información de la Empresa
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Email:</span>
                  <span className="ml-2 text-gray-900">{company.email}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Teléfono:</span>
                  <span className="ml-2 text-gray-900">{company.phone}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Dirección:</span>
                  <span className="ml-2 text-gray-900">{company.address}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">NIF/CIF:</span>
                  <span className="ml-2 text-gray-900">{company.taxId}</span>
                </div>
                {company.website && (
                  <div className="md:col-span-2">
                    <span className="font-medium text-gray-600">Sitio Web:</span>
                    <a 
                      href={company.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      {company.website}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Vehicles Section */}
        {currentSection === 'vehicles' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Gestión de Vehículos
            </h2>
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <svg className="w-16 h-16 text-blue-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 011 1v2a1 1 0 01-1 1h-1v10a2 2 0 01-2 2H6a2 2 0 01-2-2V8H3a1 1 0 01-1-1V5a1 1 0 011-1h4z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Sección de Vehículos
              </h3>
              <p className="text-gray-600">
                Aquí podrás gestionar todos los vehículos de tu flota de transporte de mascotas.
              </p>
            </div>
          </div>
        )}

        {/* Routes Section */}
        {currentSection === 'routes' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Gestión de Rutas
            </h2>
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <svg className="w-16 h-16 text-green-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Sección de Rutas
              </h3>
              <p className="text-gray-600">
                Aquí podrás planificar y optimizar las rutas de transporte para tus servicios.
              </p>
            </div>
          </div>
        )}

        {/* Bookings Section */}
        {currentSection === 'bookings' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Gestión de Reservas
            </h2>
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <svg className="w-16 h-16 text-purple-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2h3z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Sección de Reservas
              </h3>
              <p className="text-gray-600">
                Aquí podrás administrar todas las reservas y citas de transporte de mascotas.
              </p>
            </div>
          </div>
        )}

        {/* Profile Section */}
        {currentSection === 'profile' && (
          <EditCompanyProfile 
            onCancel={() => navigateToSection('main')}
            onUpdateSuccess={handleProfileUpdate}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;