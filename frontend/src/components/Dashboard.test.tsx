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

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

// Mock window.location.reload
Object.defineProperty(window, 'location', {
  value: {
    reload: jest.fn(),
  },
  writable: true,
});

describe('Dashboard Component', () => {
  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    
    // Mock localStorage globally
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });
  });

  test('displays loading state when no company data in localStorage', () => {
    localStorageMock.getItem.mockReturnValue(null);
    
    render(<Dashboard />);
    
    expect(screen.getByText(/cargando\.\.\./i)).toBeInTheDocument();
  });

  test('renders dashboard with company information from localStorage', async () => {
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockCompany));
    
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText(/panel de control/i)).toBeInTheDocument();
    });
    
    expect(screen.getByText('Test Company')).toBeInTheDocument();
    expect(screen.getByText(/bienvenido, testuser/i)).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  test('displays all company details correctly', async () => {
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockCompany));
    
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Company')).toBeInTheDocument();
    });
    
    expect(screen.getByText(/bienvenido, testuser/i)).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('123-456-7890')).toBeInTheDocument();
    expect(screen.getByText('123 Test St')).toBeInTheDocument();
    expect(screen.getByText('12345678A')).toBeInTheDocument();
    expect(screen.getByText('https://test.com')).toBeInTheDocument();
  });

  test('shows navigation menu items', async () => {
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockCompany));
    
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText(/panel de control/i)).toBeInTheDocument();
    });
    
    expect(screen.getByRole('heading', { name: /vehículos/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /rutas/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /reservas/i })).toBeInTheDocument();
  });

  test('shows edit profile button', async () => {
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockCompany));
    
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByTitle(/editar perfil de empresa/i)).toBeInTheDocument();
    });
  });

  test('shows logout button', async () => {
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockCompany));
    
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /cerrar sesión/i })).toBeInTheDocument();
    });
  });

  test('handles logout correctly', async () => {
    const user = userEvent.setup();
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockCompany));
    
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /cerrar sesión/i })).toBeInTheDocument();
    });
    
    const logoutButton = screen.getByRole('button', { name: /cerrar sesión/i });
    await user.click(logoutButton);
    
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('kangaroute_token');
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('kangaroute_company');
    expect(window.location.reload).toHaveBeenCalled();
  });

  test('opens edit profile form when edit button is clicked', async () => {
    const user = userEvent.setup();
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockCompany));
    
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByTitle(/editar perfil de empresa/i)).toBeInTheDocument();
    });
    
    const editButton = screen.getByTitle(/editar perfil de empresa/i);
    await user.click(editButton);
    
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /editar perfil de empresa/i })).toBeInTheDocument();
    });
  });

  test('handles company with missing optional fields', async () => {
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
    
    localStorageMock.getItem.mockReturnValue(JSON.stringify(minimalCompany));
    
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Minimal Company')).toBeInTheDocument();
    });
    
    expect(screen.getByText(/bienvenido, minimaluser/i)).toBeInTheDocument();
    expect(screen.getByText('minimal@example.com')).toBeInTheDocument();
  });

  test('navigates between different sections', async () => {
    const user = userEvent.setup();
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockCompany));
    
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText(/panel de control/i)).toBeInTheDocument();
    });
    
    // Click on vehicles section
    const vehiclesButton = screen.getByRole('button', { name: /gestionar vehículos/i });
    await user.click(vehiclesButton);
    
    // Should navigate to vehicles section
    await waitFor(() => {
      expect(screen.getByText(/gestión de vehículos/i)).toBeInTheDocument();
    });
  });

  test('renders without crashing with valid company data', async () => {
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockCompany));
    
    const { container } = render(<Dashboard />);
    
    await waitFor(() => {
      expect(container.firstChild).toBeInTheDocument();
    });
  });
});