import React, { useState, useEffect } from 'react';
import AuthManager from './components/AuthManager';
import Dashboard from './components/Dashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('kangaroute_token');
    const company = localStorage.getItem('kangaroute_company');
    
    if (token && company) {
      // TODO: Optionally verify token with backend
      setIsAuthenticated(true);
    }
    
    setIsLoading(false);
  }, []);

  // Listen for authentication changes
  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem('kangaroute_token');
      setIsAuthenticated(!!token);
    };

    // Listen for manual localStorage changes
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      {isAuthenticated ? <Dashboard /> : <AuthManager />}
    </div>
  );
}

export default App;
