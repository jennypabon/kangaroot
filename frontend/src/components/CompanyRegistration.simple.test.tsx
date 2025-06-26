import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CompanyRegistration from './CompanyRegistration';

const mockOnSwitchToLogin = jest.fn();

describe('CompanyRegistration Component - Simple Tests', () => {
  beforeEach(() => {
    mockOnSwitchToLogin.mockClear();
  });

  test('renders registration form correctly', () => {
    render(<CompanyRegistration onSwitchToLogin={mockOnSwitchToLogin} />);
    
    expect(screen.getByRole('heading', { name: /registro de empresa/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /registrar empresa/i })).toBeInTheDocument();
  });

  test('renders switch to login link', () => {
    render(<CompanyRegistration onSwitchToLogin={mockOnSwitchToLogin} />);
    
    const loginLink = screen.getByText(/iniciar sesión/i);
    expect(loginLink).toBeInTheDocument();
  });

  test('calls onSwitchToLogin when login link is clicked', () => {
    render(<CompanyRegistration onSwitchToLogin={mockOnSwitchToLogin} />);
    
    const loginLink = screen.getByText(/iniciar sesión/i);
    fireEvent.click(loginLink);
    
    expect(mockOnSwitchToLogin).toHaveBeenCalledTimes(1);
  });
});