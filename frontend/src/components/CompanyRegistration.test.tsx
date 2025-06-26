import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CompanyRegistration from './CompanyRegistration';

const mockOnSwitchToLogin = jest.fn();

// Mock fetch globally
global.fetch = jest.fn();

describe('CompanyRegistration Component', () => {
  beforeEach(() => {
    mockOnSwitchToLogin.mockClear();
    (global.fetch as jest.Mock).mockClear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders registration form correctly', () => {
    render(<CompanyRegistration onSwitchToLogin={mockOnSwitchToLogin} />);
    
    expect(screen.getByRole('heading', { name: /registro de empresa/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/transportes mascotas/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/admin/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/empresa@ejemplo\.com/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/mínimo 8 caracteres/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/repite la contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /registrar empresa/i })).toBeInTheDocument();
  });

  test('shows validation errors for empty required fields', async () => {
    const user = userEvent.setup();
    render(<CompanyRegistration onSwitchToLogin={mockOnSwitchToLogin} />);
    
    const submitButton = screen.getByRole('button', { name: /registrar empresa/i });
    await user.click(submitButton);
    
    expect(screen.getByText(/el nombre de la empresa es obligatorio/i)).toBeInTheDocument();
    expect(screen.getByText(/el usuario administrador es obligatorio/i)).toBeInTheDocument();
    expect(screen.getByText(/el correo electrónico es obligatorio/i)).toBeInTheDocument();
    expect(screen.getByText(/la contraseña es obligatoria/i)).toBeInTheDocument();
  });

  test('validates password confirmation', async () => {
    const user = userEvent.setup();
    render(<CompanyRegistration onSwitchToLogin={mockOnSwitchToLogin} />);
    
    await user.type(screen.getByPlaceholderText(/mínimo 8 caracteres/i), 'password123');
    await user.type(screen.getByPlaceholderText(/repite la contraseña/i), 'differentpass');
    await user.click(screen.getByRole('button', { name: /registrar empresa/i }));
    
    expect(screen.getByText(/las contraseñas no coinciden/i)).toBeInTheDocument();
  });

  test('validates email format', async () => {
    const user = userEvent.setup();
    render(<CompanyRegistration onSwitchToLogin={mockOnSwitchToLogin} />);
    
    await user.type(screen.getByPlaceholderText(/empresa@ejemplo\.com/i), 'invalid-email');
    await user.click(screen.getByRole('button', { name: /registrar empresa/i }));
    
    expect(screen.getByText(/el correo electrónico no es válido/i)).toBeInTheDocument();
  });

  test('validates required phone field', async () => {
    const user = userEvent.setup();
    render(<CompanyRegistration onSwitchToLogin={mockOnSwitchToLogin} />);
    
    // Leave phone field empty and try to submit
    await user.click(screen.getByRole('button', { name: /registrar empresa/i }));
    
    expect(screen.getByText(/el teléfono es obligatorio/i)).toBeInTheDocument();
  });

  test('calls API on form submission with valid data', async () => {
    const user = userEvent.setup();
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({
        success: true,
        data: { company: { id: 1, companyName: 'Test Company' }, token: 'test-token' }
      })
    };
    
    (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);
    
    render(<CompanyRegistration onSwitchToLogin={mockOnSwitchToLogin} />);
    
    await user.type(screen.getByPlaceholderText(/transportes mascotas/i), 'Test Company');
    await user.type(screen.getByPlaceholderText(/admin/i), 'testuser');
    await user.type(screen.getByPlaceholderText(/empresa@ejemplo\.com/i), 'test@example.com');
    await user.type(screen.getByPlaceholderText(/mínimo 8 caracteres/i), 'password123');
    await user.type(screen.getByPlaceholderText(/repite la contraseña/i), 'password123');
    await user.type(screen.getByPlaceholderText(/\+34 123 456 789/i), '123-456-7890');
    await user.type(screen.getByPlaceholderText(/calle, número, ciudad/i), '123 Test St');
    await user.type(screen.getByPlaceholderText(/cif\/nif/i), '12345678A');
    
    await user.click(screen.getByRole('button', { name: /registrar empresa/i }));
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('http://localhost:5000/api/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: 'Test Company',
          adminUsername: 'testuser',
          password: 'password123',
          confirmPassword: 'password123',
          email: 'test@example.com',
          phone: '123-456-7890',
          address: '123 Test St',
          taxId: '12345678A',
          website: ''
        })
      });
    });
  });

  test('displays success message on successful registration', async () => {
    const user = userEvent.setup();
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({
        success: true,
        message: 'Empresa registrada exitosamente',
        data: { company: { id: 1 }, token: 'test-token' }
      })
    };
    
    (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);
    
    render(<CompanyRegistration onSwitchToLogin={mockOnSwitchToLogin} />);
    
    // Fill out required fields
    await user.type(screen.getByPlaceholderText(/transportes mascotas/i), 'Test Company');
    await user.type(screen.getByPlaceholderText(/admin/i), 'testuser');
    await user.type(screen.getByPlaceholderText(/empresa@ejemplo\.com/i), 'test@example.com');
    await user.type(screen.getByPlaceholderText(/mínimo 8 caracteres/i), 'password123');
    await user.type(screen.getByPlaceholderText(/repite la contraseña/i), 'password123');
    await user.type(screen.getByPlaceholderText(/\+34 123 456 789/i), '123-456-7890');
    await user.type(screen.getByPlaceholderText(/calle, número, ciudad/i), '123 Test St');
    await user.type(screen.getByPlaceholderText(/cif\/nif/i), '12345678A');
    
    await user.click(screen.getByRole('button', { name: /registrar empresa/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/empresa registrada exitosamente/i)).toBeInTheDocument();
    });
  });

  test('calls onSwitchToLogin when login link is clicked', async () => {
    const user = userEvent.setup();
    render(<CompanyRegistration onSwitchToLogin={mockOnSwitchToLogin} />);
    
    const loginLink = screen.getByText(/iniciar sesión/i);
    await user.click(loginLink);
    
    expect(mockOnSwitchToLogin).toHaveBeenCalledTimes(1);
  });
});