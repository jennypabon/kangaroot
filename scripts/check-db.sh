#!/bin/bash

echo "🔍 Verificando base de datos Kangaroute..."
echo "========================================"

echo
echo "📊 Total de empresas registradas:"
psql kangaroute -c "SELECT COUNT(*) as total FROM companies;"

echo
echo "📋 Últimas empresas registradas:"
psql kangaroute -c "SELECT company_name, email, created_at FROM companies ORDER BY created_at DESC LIMIT 5;"

echo
echo "✅ Estado de la base de datos:"
psql kangaroute -c "SELECT 'Database is working!' as status;"