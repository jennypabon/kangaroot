import { Pool } from 'pg';

// Test database configuration
const testDbConfig = {
  connectionString: process.env.TEST_DATABASE_URL || 'postgresql://localhost:5432/kangaroute_test',
  ssl: false
};

export let testPool: Pool;

async function clearTestDatabase() {
  if (!testPool) return;
  
  try {
    // Delete all data from companies table
    await testPool.query('DELETE FROM companies WHERE 1=1');
    
    // Reset auto-increment sequences
    await testPool.query('ALTER SEQUENCE companies_id_seq RESTART WITH 1');
  } catch (error) {
    console.error('Error clearing test database:', error);
  }
}

export async function setupTestDatabase() {
  // Create test database pool if it doesn't exist
  if (!testPool) {
    testPool = new Pool(testDbConfig);
  }
  
  // Clear test database before running tests
  await clearTestDatabase();
}

export async function cleanupTestDatabase() {
  // Clean up after each test
  await clearTestDatabase();
  
  // Close database connections after tests
  if (testPool) {
    await testPool.end();
    testPool = undefined as any;
  }
}