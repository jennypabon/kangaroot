import dotenv from 'dotenv';
import path from 'path';

export default async function globalSetup() {
  // Load test environment variables
  dotenv.config({ path: path.resolve(__dirname, '../../.env.test') });
  
  console.log('🧪 Setting up test environment...');
  console.log(`Test database: ${process.env.TEST_DATABASE_URL}`);
}