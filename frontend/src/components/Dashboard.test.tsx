import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Dashboard from './Dashboard';

const mockCompany = {
  id: 1,
  companyName: 'Test Company',
  adminUsername: 'testuser',
  email: 'test@example.com',
  phone: '123-456-7890',
  address: '123 Test St',
  taxId: '12345678A',
  website: 'https://test.com'
};

const mockOnLogout = jest.fn();

describe('Dashboard Component', () => {
  beforeEach(() => {
    mockOnLogout.mockClear();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders dashboard with company information', () => {
    render(<Dashboard company={mockCompany} onLogout={mockOnLogout} />);
    
    expect(screen.getByText(/panel de administración/i)).toBeInTheDocument();
    expect(screen.getByText(/test company/i)).toBeInTheDocument();
    expect(screen.getByText(/información de la empresa/i)).toBeInTheDocument();
    expect(screen.getByText(/testuser/i)).toBeInTheDocument();
    expect(screen.getByText(/test@example.com/i)).toBeInTheDocument();
  });

  test('displays all company details correctly', () => {
    render(<Dashboard company={mockCompany} onLogout={mockOnLogout} />);
    
    expect(screen.getByText('Test Company')).toBeInTheDocument();
    expect(screen.getByText('testuser')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('123-456-7890')).toBeInTheDocument();
    expect(screen.getByText('123 Test St')).toBeInTheDocument();
    expect(screen.getByText('12345678A')).toBeInTheDocument();
    expect(screen.getByText('https://test.com')).toBeInTheDocument();
  });

  test('shows edit profile button', () => {
    render(<Dashboard company={mockCompany} onLogout={mockOnLogout} />);
    
    expect(screen.getByRole('button', { name: /editar perfil/i })).toBeInTheDocument();
  });

  test('shows logout button', () => {
    render(<Dashboard company={mockCompany} onLogout={mockOnLogout} />);
    
    expect(screen.getByRole('button', { name: /cerrar sesión/i })).toBeInTheDocument();
  });

  test('calls onLogout when logout button is clicked', async () => {
    const user = userEvent.setup();
    render(<Dashboard company={mockCompany} onLogout={mockOnLogout} />);
    
    const logoutButton = screen.getByRole('button', { name: /cerrar sesión/i });
    await user.click(logoutButton);
    
    expect(mockOnLogout).toHaveBeenCalledTimes(1);
  });

  test('opens edit profile form when edit button is clicked', async () => {
    const user = userEvent.setup();
    render(<Dashboard company={mockCompany} onLogout={mockOnLogout} />);
    
    const editButton = screen.getByRole('button', { name: /editar perfil/i });
    await user.click(editButton);
    
    expect(screen.getByText(/editar información de la empresa/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Company')).toBeInTheDocument();
    expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();
  });

  test('handles company with missing optional fields', () => {
    const minimalCompany = {
      id: 1,
      companyName: 'Minimal Company',
      adminUsername: 'minimaluser',
      email: 'minimal@example.com',
      phone: '',
      address: '',
      taxId: '',
      website: ''
    };
    
    render(<Dashboard company={minimalCompany} onLogout={mockOnLogout} />);
    
    expect(screen.getByText('Minimal Company')).toBeInTheDocument();
    expect(screen.getByText('minimaluser')).toBeInTheDocument();
    expect(screen.getByText('minimal@example.com')).toBeInTheDocument();
  });

  test('displays navigation menu items', () => {
    render(<Dashboard company={mockCompany} onLogout={mockOnLogout} />);
    
    expect(screen.getByText(/clientes/i)).toBeInTheDocument();
    expect(screen.getByText(/rutas/i)).toBeInTheDocument();
    expect(screen.getByText(/reservas/i)).toBeInTheDocument();
    expect(screen.getByText(/facturación/i)).toBeInTheDocument();
  });

  test('shows company statistics section', () => {
    render(<Dashboard company={mockCompany} onLogout={mockOnLogout} />);
    
    expect(screen.getByText(/estadísticas/i)).toBeInTheDocument();
  });

  test('renders without crashing with valid company prop', () => {
    const { container } = render(<Dashboard company={mockCompany} onLogout={mockOnLogout} />);
    expect(container.firstChild).toBeInTheDocument();
  });
});