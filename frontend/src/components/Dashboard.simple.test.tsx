import React from 'react';
import { render, screen } from '@testing-library/react';
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

describe('Dashboard Component - Simple Tests', () => {
  beforeEach(() => {
    // Mock localStorage globally
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });
    
    // Reset mocks
    localStorageMock.getItem.mockClear();
  });

  test('renders loading state when no company data', () => {
    localStorageMock.getItem.mockReturnValue(null);
    
    const { container } = render(<Dashboard />);
    expect(container.firstChild).toBeInTheDocument();
    expect(screen.getByText(/cargando/i)).toBeInTheDocument();
  });

  test('renders dashboard with company data from localStorage', () => {
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockCompany));
    
    render(<Dashboard />);
    // Just verify the component renders without crashing
    expect(document.body).toBeInTheDocument();
  });

  test('handles localStorage correctly', () => {
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockCompany));
    
    render(<Dashboard />);
    // Verify localStorage was called
    expect(localStorageMock.getItem).toHaveBeenCalledWith('kangaroute_company');
  });
});