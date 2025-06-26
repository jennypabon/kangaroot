import request from 'supertest';
import express from 'express';
import { login } from '../authController';
import { testPool, cleanupTestDatabase, setupTestDatabase } from '../../tests/setup';

const app = express();
app.use(express.json());
app.post('/api/auth/login', login);

describe('AuthController', () => {
  beforeAll(async () => {
    await setupTestDatabase();
  });

  afterAll(async () => {
    await cleanupTestDatabase();
  });

  beforeEach(async () => {
    // Clean the companies table before each test
    await testPool.query('DELETE FROM companies WHERE 1=1');
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Insert a test company for login tests
      await testPool.query(`
        INSERT INTO companies (
          company_name, admin_username, email, password_hash, 
          phone, address, tax_id, website, created_at, updated_at
        ) VALUES (
          'Test Company', 'testuser', 'test@example.com', 
          '$2b$10$GyBRaQ3mOECoTwmt9dESEuhd749paLQcMLbtwmhYYff8vszEehZj2', 
          '123-456-7890', '123 Test St', '12345678A', 
          'https://test.com', NOW(), NOW()
        )
      `);
    });

    test('should login successfully with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'secret123'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.company).toBeDefined();
      expect(response.body.data.company.companyName).toBe('Test Company');
      expect(response.body.data.company.adminUsername).toBe('testuser');
      expect(response.body.data.company.email).toBe('test@example.com');
      
      // Should not return password hash
      expect(response.body.data.company.password_hash).toBeUndefined();
    });

    test('should fail with invalid username', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'wronguser',
          password: 'secret123'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Usuario o contraseña incorrectos');
    });

    test('should fail with invalid password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Usuario o contraseña incorrectos');
    });

    test('should fail with missing username', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          password: 'secret123'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Usuario y contraseña son obligatorios');
    });

    test('should fail with missing password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'testuser'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Usuario y contraseña son obligatorios');
    });

    test('should fail with empty credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: '',
          password: ''
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Usuario y contraseña son obligatorios');
    });

    test('should return proper JSON structure on successful login', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'secret123'
        });

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toMatch(/application\/json/);
      
      // Verify response structure
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data).toHaveProperty('company');
      
      // Verify company structure
      const company = response.body.data.company;
      expect(company).toHaveProperty('id');
      expect(company).toHaveProperty('companyName');
      expect(company).toHaveProperty('adminUsername');
      expect(company).toHaveProperty('email');
      expect(company).toHaveProperty('phone');
      expect(company).toHaveProperty('address');
      expect(company).toHaveProperty('taxId');
      expect(company).toHaveProperty('website');
    });

    test('should handle database connection errors gracefully', async () => {
      // Mock the main database pool instead of test pool
      const poolModule = require('../../config/database');
      const originalQuery = poolModule.default.query;
      poolModule.default.query = jest.fn().mockRejectedValue(new Error('Database connection error'));
      
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'secret123'
        });

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Error interno del servidor');
      
      // Restore the original query function
      poolModule.default.query = originalQuery;
    });

    test('should validate JWT token format', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'secret123'
        });

      expect(response.status).toBe(200);
      const token = response.body.data.token;
      
      // JWT should have 3 parts separated by dots
      const tokenParts = token.split('.');
      expect(tokenParts).toHaveLength(3);
      
      // Each part should be base64 encoded
      tokenParts.forEach((part: string) => {
        expect(part).toMatch(/^[A-Za-z0-9_-]+$/);
      });
    });
  });
});