# Kangaroute

Plataforma SaaS para empresas de transporte de mascotas. Sistema multi-tenant que permite a cada empresa gestionar clientes, rutas y reservas con su propio panel y web independiente.

## Estructura del Proyecto

- `frontend/` - Aplicaci�n React + TypeScript
- `backend/` - API Node.js + Express
- `database/` - Esquemas y migraciones
- `docs/` - Documentaci�n

## Tecnolog�as

- Frontend: React, TypeScript, Tailwind CSS
- Backend: Node.js, Express, TypeScript
- Base de datos: PostgreSQL
- Autenticaci�n: JWT
- Arquitectura: Multi-tenant

## Características

- Panel administrativo para cada empresa
- Gestión de clientes y mascotas
- Planificación de rutas de transporte
- Sistema de reservas
- Facturación y pagos
- Web pública personalizable por empresa

## Instalación y Configuración Local

### Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (versión 16 o superior)
- [PostgreSQL](https://www.postgresql.org/download/)
- [Git](https://git-scm.com/)

### Paso 1: Clonar el Repositorio

```bash
git clone <url-del-repositorio>
cd kangaroute
```

### Paso 2: Configurar la Base de Datos

1. **Iniciar PostgreSQL:**
   ```bash
   # En macOS con Homebrew
   brew services start postgresql
   
   # En Linux (Ubuntu/Debian)
   sudo service postgresql start
   
   # En Windows, usar el servicio desde Services
   ```

2. **Crear la base de datos:**
   ```bash
   createdb kangaroute
   ```

3. **Ejecutar el script de inicialización:**
   ```bash
   psql kangaroute < database/init.sql
   ```

### Paso 3: Configurar el Backend

1. **Navegar al directorio backend:**
   ```bash
   cd backend/
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   El archivo `.env` ya está creado con valores por defecto. Si necesitas modificar la configuración de la base de datos, edita:
   ```env
   PORT=5000
   DATABASE_URL=postgresql://localhost:5432/kangaroute
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   ```

4. **Iniciar el servidor backend:**
   ```bash
   npm run dev
   ```
   
   El backend estará disponible en: `http://localhost:5000`

### Paso 4: Configurar el Frontend

1. **Abrir una nueva terminal y navegar al directorio frontend:**
   ```bash
   cd frontend/
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo:**
   ```bash
   npm start
   ```
   
   El frontend estará disponible en: `http://localhost:3000`

### Paso 5: Verificar la Instalación

1. **Verificar que el backend está funcionando:**
   Visita `http://localhost:5000/api/health` - deberías ver:
   ```json
   {"status":"OK","message":"Kangaroute API is running"}
   ```

2. **Verificar que el frontend está funcionando:**
   Visita `http://localhost:3000` - deberías ver el formulario de registro de empresas.

3. **Probar el registro de empresa:**
   Completa el formulario con datos de prueba y verifica que se guarde correctamente en la base de datos.

### Scripts Disponibles

#### Backend (`backend/` directory)
- `npm run dev` - Iniciar servidor de desarrollo con hot reload
- `npm run build` - Compilar TypeScript a JavaScript
- `npm start` - Iniciar servidor de producción

#### Frontend (`frontend/` directory)
- `npm start` - Iniciar servidor de desarrollo
- `npm run build` - Crear build de producción
- `npm test` - Ejecutar tests

### Solución de Problemas

**Error de conexión a PostgreSQL:**
- Verifica que PostgreSQL esté ejecutándose: `pg_isready`
- Verifica que la base de datos existe: `psql -l | grep kangaroute`

**Error de puertos ocupados:**
- Backend (puerto 5000): Cambia el `PORT` en `.env`
- Frontend (puerto 3000): React te ofrecerá usar otro puerto automáticamente

**Error de CORS:**
- Verifica que el backend esté ejecutándose en `http://localhost:5000`
- El CORS ya está configurado para desarrollo local

### Estructura de URLs

- **Frontend:** `http://localhost:3000`
- **Backend API:** `http://localhost:5000/api`
- **Health Check:** `http://localhost:5000/api/health`
- **Registro de Empresas:** `POST http://localhost:5000/api/companies`