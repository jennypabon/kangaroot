import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CompanyRegistration from './CompanyRegistration';

const mockOnSwitchToLogin = jest.fn();

describe('CompanyRegistration Component', () => {
  beforeEach(() => {
    mockOnSwitchToLogin.mockClear();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders registration form correctly', () => {
    render(<CompanyRegistration onSwitchToLogin={mockOnSwitchToLogin} />);
    
    expect(screen.getByRole('heading', { name: /registro de empresa/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/nombre de la empresa/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/nombre de usuario del administrador/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirmar contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /registrar empresa/i })).toBeInTheDocument();
  });

  test('shows validation errors for empty required fields', async () => {
    const user = userEvent.setup();
    render(<CompanyRegistration onSwitchToLogin={mockOnSwitchToLogin} />);
    
    const submitButton = screen.getByRole('button', { name: /registrar empresa/i });
    await user.click(submitButton);
    
    expect(screen.getByText(/el nombre de la empresa es obligatorio/i)).toBeInTheDocument();
    expect(screen.getByText(/el nombre de usuario es obligatorio/i)).toBeInTheDocument();
    expect(screen.getByText(/el email es obligatorio/i)).toBeInTheDocument();
    expect(screen.getByText(/la contraseña es obligatoria/i)).toBeInTheDocument();
  });

  test('validates password confirmation', async () => {
    const user = userEvent.setup();
    render(<CompanyRegistration onSwitchToLogin={mockOnSwitchToLogin} />);
    
    await user.type(screen.getByLabelText(/contraseña/i), 'password123');
    await user.type(screen.getByLabelText(/confirmar contraseña/i), 'differentpass');
    await user.click(screen.getByRole('button', { name: /registrar empresa/i }));
    
    expect(screen.getByText(/las contraseñas no coinciden/i)).toBeInTheDocument();
  });

  test('validates email format', async () => {
    const user = userEvent.setup();
    render(<CompanyRegistration onSwitchToLogin={mockOnSwitchToLogin} />);
    
    await user.type(screen.getByLabelText(/email/i), 'invalid-email');
    await user.click(screen.getByRole('button', { name: /registrar empresa/i }));
    
    expect(screen.getByText(/email no válido/i)).toBeInTheDocument();
  });

  test('validates phone number format', async () => {
    const user = userEvent.setup();
    render(<CompanyRegistration onSwitchToLogin={mockOnSwitchToLogin} />);
    
    await user.type(screen.getByLabelText(/teléfono/i), 'invalid-phone');
    await user.click(screen.getByRole('button', { name: /registrar empresa/i }));
    
    expect(screen.getByText(/formato de teléfono no válido/i)).toBeInTheDocument();
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
    
    await user.type(screen.getByLabelText(/nombre de la empresa/i), 'Test Company');
    await user.type(screen.getByLabelText(/nombre de usuario del administrador/i), 'testuser');
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/contraseña/i), 'password123');
    await user.type(screen.getByLabelText(/confirmar contraseña/i), 'password123');
    await user.type(screen.getByLabelText(/teléfono/i), '123-456-7890');
    await user.type(screen.getByLabelText(/dirección/i), '123 Test St');
    await user.type(screen.getByLabelText(/nif\/cif/i), '12345678A');
    
    await user.click(screen.getByRole('button', { name: /registrar empresa/i }));
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('http://localhost:5000/api/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: 'Test Company',
          adminUsername: 'testuser',
          email: 'test@example.com',
          password: 'password123',
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
    
    await user.type(screen.getByLabelText(/nombre de la empresa/i), 'Test Company');
    await user.type(screen.getByLabelText(/nombre de usuario del administrador/i), 'testuser');
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/contraseña/i), 'password123');
    await user.type(screen.getByLabelText(/confirmar contraseña/i), 'password123');
    
    await user.click(screen.getByRole('button', { name: /registrar empresa/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/empresa registrada exitosamente/i)).toBeInTheDocument();
    });
  });

  test('displays error message on failed registration', async () => {
    const user = userEvent.setup();
    const mockResponse = {
      ok: false,
      json: () => Promise.resolve({
        success: false,
        message: 'El email ya está en uso'
      })
    };
    
    (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);
    
    render(<CompanyRegistration onSwitchToLogin={mockOnSwitchToLogin} />);
    
    await user.type(screen.getByLabelText(/nombre de la empresa/i), 'Test Company');
    await user.type(screen.getByLabelText(/nombre de usuario del administrador/i), 'testuser');
    await user.type(screen.getByLabelText(/email/i), 'existing@example.com');
    await user.type(screen.getByLabelText(/contraseña/i), 'password123');
    await user.type(screen.getByLabelText(/confirmar contraseña/i), 'password123');
    
    await user.click(screen.getByRole('button', { name: /registrar empresa/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/el email ya está en uso/i)).toBeInTheDocument();
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