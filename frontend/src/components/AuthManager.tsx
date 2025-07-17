import React, { useState } from 'react';
import CompanyRegistration from './CompanyRegistration';
import CompanyLogin from './CompanyLogin';

type AuthView = 'login' | 'register';

const AuthManager: React.FC = () => {
  const [currentView, setCurrentView] = useState<AuthView>('register');

  const switchToLogin = () => {
    setCurrentView('login');
  };

  const switchToRegister = () => {
    setCurrentView('register');
  };

  return (
    <>
      {currentView === 'register' ? (
        <CompanyRegistration onSwitchToLogin={switchToLogin} />
      ) : (
        <CompanyLogin onSwitchToRegister={switchToRegister} />
      )}
    </>
  );
};

export default AuthManager;