import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CompanyLogin from './CompanyLogin';

const mockOnSwitchToRegister = jest.fn();

describe('CompanyLogin Component - Simple Tests', () => {
  beforeEach(() => {
    mockOnSwitchToRegister.mockClear();
  });

  test('renders login form correctly', () => {
    render(<CompanyLogin onSwitchToRegister={mockOnSwitchToRegister} />);
    
    expect(screen.getByRole('heading', { name: /iniciar sesión/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
  });

  test('renders switch to register button', () => {
    render(<CompanyLogin onSwitchToRegister={mockOnSwitchToRegister} />);
    
    const registerButton = screen.getByText(/registrar nueva empresa/i);
    expect(registerButton).toBeInTheDocument();
  });

  test('calls onSwitchToRegister when register button is clicked', () => {
    render(<CompanyLogin onSwitchToRegister={mockOnSwitchToRegister} />);
    
    const registerButton = screen.getByText(/registrar nueva empresa/i);
    fireEvent.click(registerButton);
    
    expect(mockOnSwitchToRegister).toHaveBeenCalledTimes(1);
  });
});