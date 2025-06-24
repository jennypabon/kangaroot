-- Create database if it doesn't exist
-- Note: This needs to be run manually as a superuser
-- CREATE DATABASE kangaroute;

-- Use the kangaroute database
-- \c kangaroute;

-- Create companies table
CREATE TABLE IF NOT EXISTS companies (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    admin_username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50) NOT NULL,
    address TEXT NOT NULL,
    tax_id VARCHAR(50) NOT NULL UNIQUE,
    website VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_companies_email ON companies(email);
CREATE INDEX IF NOT EXISTS idx_companies_admin_username ON companies(admin_username);
CREATE INDEX IF NOT EXISTS idx_companies_tax_id ON companies(tax_id);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_companies_updated_at 
    BEFORE UPDATE ON companies 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();