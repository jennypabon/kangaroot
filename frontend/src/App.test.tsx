import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
  test('renders app without crashing', () => {
    render(<App />);
    expect(document.body).toBeInTheDocument();
  });

  test('displays company registration form by default', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /registro de empresa/i })).toBeInTheDocument();
  });
});
