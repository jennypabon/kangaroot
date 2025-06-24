-- Consultas útiles para Kangaroute Database

-- Ver todas las empresas
SELECT 
    id,
    company_name,
    admin_username,
    email,
    phone,
    created_at,
    is_active
FROM companies 
ORDER BY created_at DESC;

-- Buscar empresa por email
SELECT * FROM companies WHERE email = 'empresa@ejemplo.com';

-- Contar empresas activas
SELECT COUNT(*) as total_empresas_activas FROM companies WHERE is_active = true;

-- Ver empresas creadas hoy
SELECT 
    company_name,
    email,
    created_at
FROM companies 
WHERE DATE(created_at) = CURRENT_DATE;

-- Ver últimas 5 empresas registradas
SELECT 
    company_name,
    admin_username,
    email,
    created_at
FROM companies 
ORDER BY created_at DESC 
LIMIT 5;

-- Buscar por nombre de empresa (case insensitive)
SELECT * FROM companies 
WHERE LOWER(company_name) LIKE LOWER('%transporte%');

-- Ver estructura de la tabla
-- \d companies

-- Ver todas las tablas de la base de datos
-- \dt