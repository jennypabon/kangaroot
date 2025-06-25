import { jest } from '@jest/globals';

// Mock pool with proper typing
export const createMockPool = () => ({
  query: jest.fn()
});

// Mock bcrypt with proper typing
export const createMockBcrypt = () => ({
  hash: jest.fn(),
  compare: jest.fn()
});

// Mock jwt with proper typing
export const createMockJwt = () => ({
  sign: jest.fn(),
  verify: jest.fn()
});