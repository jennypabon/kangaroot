import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CompanyLogin from './CompanyLogin';

const mockOnSwitchToRegister = jest.fn();

// Mock fetch globally
global.fetch = jest.fn();

describe('CompanyLogin Component', () => {
  beforeEach(() => {
    mockOnSwitchToRegister.mockClear();
    (global.fetch as jest.Mock).mockClear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders login form correctly', () => {
    render(<CompanyLogin onSwitchToRegister={mockOnSwitchToRegister} />);
    
    expect(screen.getByRole('heading', { name: /iniciar sesión/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/ingresa tu usuario/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/ingresa tu contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
  });

  test('shows validation errors for empty fields', async () => {
    const user = userEvent.setup();
    render(<CompanyLogin onSwitchToRegister={mockOnSwitchToRegister} />);
    
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
    await user.click(submitButton);
    
    expect(screen.getByText(/el usuario es obligatorio/i)).toBeInTheDocument();
    expect(screen.getByText(/la contraseña es obligatoria/i)).toBeInTheDocument();
  });

  test('calls API on form submission with valid data', async () => {
    const user = userEvent.setup();
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({
        success: true,
        data: { token: 'test-token', company: { id: 1, companyName: 'Test Co' } }
      })
    };
    
    (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);
    
    render(<CompanyLogin onSwitchToRegister={mockOnSwitchToRegister} />);
    
    await user.type(screen.getByPlaceholderText(/ingresa tu usuario/i), 'testuser');
    await user.type(screen.getByPlaceholderText(/ingresa tu contraseña/i), 'password123');
    await user.click(screen.getByRole('button', { name: /iniciar sesión/i }));
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'testuser', password: 'password123' })
      });
    });
  });

  test('displays error message on failed login', async () => {
    const user = userEvent.setup();
    const mockResponse = {
      ok: false,
      json: () => Promise.resolve({
        success: false,
        message: 'Usuario o contraseña incorrectos'
      })
    };
    
    (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);
    
    render(<CompanyLogin onSwitchToRegister={mockOnSwitchToRegister} />);
    
    await user.type(screen.getByPlaceholderText(/ingresa tu usuario/i), 'wronguser');
    await user.type(screen.getByPlaceholderText(/ingresa tu contraseña/i), 'wrongpass');
    await user.click(screen.getByRole('button', { name: /iniciar sesión/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/usuario o contraseña incorrectos/i)).toBeInTheDocument();
    });
  });

  test('calls onSwitchToRegister when register link is clicked', async () => {
    const user = userEvent.setup();
    render(<CompanyLogin onSwitchToRegister={mockOnSwitchToRegister} />);
    
    const registerLink = screen.getByText(/registrar nueva empresa/i);
    await user.click(registerLink);
    
    expect(mockOnSwitchToRegister).toHaveBeenCalledTimes(1);
  });

  test('clears errors when user starts typing', async () => {
    const user = userEvent.setup();
    render(<CompanyLogin onSwitchToRegister={mockOnSwitchToRegister} />);
    
    // First trigger validation errors
    await user.click(screen.getByRole('button', { name: /iniciar sesión/i }));
    expect(screen.getByText(/el usuario es obligatorio/i)).toBeInTheDocument();
    
    // Then start typing to clear the error
    await user.type(screen.getByPlaceholderText(/ingresa tu usuario/i), 'test');
    expect(screen.queryByText(/el usuario es obligatorio/i)).not.toBeInTheDocument();
  });

  test('displays loading state during form submission', async () => {
    const user = userEvent.setup();
    
    // Mock a delayed response
    (global.fetch as jest.Mock).mockImplementation(() => 
      new Promise(resolve => 
        setTimeout(() => resolve({
          ok: true,
          json: () => Promise.resolve({ success: true, data: {} })
        }), 100)
      )
    );
    
    render(<CompanyLogin onSwitchToRegister={mockOnSwitchToRegister} />);
    
    await user.type(screen.getByPlaceholderText(/ingresa tu usuario/i), 'testuser');
    await user.type(screen.getByPlaceholderText(/ingresa tu contraseña/i), 'password123');
    
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
    await user.click(submitButton);
    
    // The button should be disabled during loading
    expect(submitButton).toBeDisabled();
  });
});