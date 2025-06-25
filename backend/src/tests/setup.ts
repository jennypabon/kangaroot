import { Pool } from 'pg';

// Test database configuration
const testDbConfig = {
  connectionString: process.env.TEST_DATABASE_URL || 'postgresql://localhost:5432/kangaroute_test',
  ssl: false
};

let testPool: Pool;

beforeAll(async () => {
  // Create test database pool
  testPool = new Pool(testDbConfig);
  
  // Clear test database before running tests
  await clearTestDatabase();
});

afterAll(async () => {
  // Close database connections after tests
  if (testPool) {
    await testPool.end();
  }
});

afterEach(async () => {
  // Clean up after each test
  await clearTestDatabase();
});

async function clearTestDatabase() {
  try {
    // Delete all data from companies table
    await testPool.query('DELETE FROM companies');
    
    // Reset auto-increment sequences
    await testPool.query('ALTER SEQUENCE companies_id_seq RESTART WITH 1');
  } catch (error) {
    console.error('Error clearing test database:', error);
  }
}

export { testPool };