# 🚗 Sistema de Gestión para Autolote - CEUTEC

## 🎯 Objetivo del Sistema

Plataforma integral de **gestión 360°** para un autolote, que incluye:
- Control completo de inventario de vehículos
- Módulo transaccional de ventas con cálculo de impuestos
- Gestión de relaciones con clientes (CRM)
- Catálogo de accesorios externos mediante integración de APIs de terceros

Desarrollado como proyecto académico para la clase de Programación en CEUTEC.

## 🏗️ Arquitectura del Proyecto

El proyecto sigue una arquitectura **cliente-servidor** separada:

```
Proyecto_Autolote/
├── backend_File/          # API REST con Node.js/Express
│   ├── app.js            # Punto de entrada principal
│   ├── config/
│   │   └── db.js         # Configuración de pool MySQL
│   ├── middleware/
│   │   └── authMiddleware.js  # Autenticación JWT
│   ├── routes/           # Endpoints organizados por módulo
│   │   ├── authRoute.js
│   │   ├── vehiculosRoute.js
│   │   ├── clientesRoute.js
│   │   ├── ventasRoute.js
│   │   └── thirdpartyRoute.js
│   └── sql/
│       └── DDL.sql       # Esquema de base de datos
├── T38-frontend/         # Aplicación SPA con Angular
│   ├── src/app/
│   │   ├── component/    # Componentes por funcionalidad
│   │   ├── services/     # Servicios para consumo de API
│   │   └── app.routes.ts # Configuración de rutas
│   └── public/           # Assets estáticos
└── README.md
```

## ✨ Funcionalidades Implementadas

### 🔐 Seguridad
- **Autenticación robusta** con JWT (JSON Web Tokens)
- Protección de rutas mediante `AuthMiddleware`
- Hashing de contraseñas con bcrypt
- Roles de usuario (ADMIN, VENDEDOR)

### 📦 Gestión de Inventario
- **CRUD completo** de vehículos:
  - Marca, Modelo, Año, Precio, Disponibilidad
- Filtros avanzados por marca, estado y precio máximo
- Actualización de stock en tiempo real

### 💰 Módulo de Ventas
- Registro de transacciones completas
- Vinculación: Cliente + Vehículo + Vendedor
- Cálculo automático de **PrecioTotal** e **Impuestos**
- Historial de ventas con auditoría

### 👥 CRM & Consultas
- Sistema para que clientes envíen mensajes sobre vehículos específicos
- Almacenamiento de historial en tabla `Consultas`
- Seguimiento de intereses y consultas por vehículo

### 🔗 Integración de Terceros
- Consumo de **FakeStoreAPI** mediante Axios
- Visualización de accesorios adicionales en la interfaz
- Endpoint seguro protegido con JWT

## 📡 Arquitectura de la API

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| `POST` | `/api/login` | Autenticación de usuario | ❌ |
| `GET` | `/api/vehiculos` | Listar todos los vehículos | ❌ |
| `GET` | `/api/vehiculos/filtrar/marca/:marca` | Filtrar por marca | ❌ |
| `GET` | `/api/vehiculos/filtrar/estado/:estado` | Filtrar por disponibilidad | ❌ |
| `GET` | `/api/vehiculos/filtrar/precio/:preciomax` | Filtrar por precio máximo | ❌ |
| `POST` | `/api/vehiculos/registrar/vehiculo` | Registrar nuevo vehículo | ✅ JWT |
| `PUT` | `/api/vehiculos/modificar/vehiculo/:id` | Actualizar vehículo | ✅ JWT |
| `DELETE` | `/api/vehiculos/eliminar/vehiculo/:id` | Eliminar vehículo | ❌ |
| `GET` | `/api/clientes` | Listar clientes | ✅ JWT |
| `POST` | `/api/clientes` | Crear cliente | ✅ JWT |
| `GET` | `/api/ventas` | Listar ventas | ✅ JWT |
| `POST` | `/api/ventas` | Registrar venta (usa VendedorId, calcula PrecioTotal) | ✅ JWT |
| `POST` | `/api/registrar/consulta` | Registrar consulta de cliente por vehículo | ✅ JWT |
| `GET` | `/api/thirdparty/products` | Obtener productos de FakeStoreAPI | ✅ JWT |

## 🛠️ Tecnologías Clave

### Backend
- **Node.js** + **Express.js**: Framework para API REST
- **MySQL** con pool de conexiones para BD relacional
- **JWT**: Autenticación y autorización
- **bcrypt**: Hashing de contraseñas
- **Axios**: Cliente HTTP para integraciones externas
- **CORS**: Manejo de orígenes cruzados

### Frontend
- **Angular 18+**: Framework SPA moderno
- **SCSS**: Preprocesador para estilos avanzados
- **CommonModule**: Directivas básicas (*ngIf, *ngFor)
- **HttpClient**: Consumo asíncrono de servicios REST
- **RxJS**: Programación reactiva para observables

## 🚀 Guía de Instalación

### Prerrequisitos
- Node.js (v16+)
- MySQL Server
- Angular CLI (`npm install -g @angular/cli`)

### Backend (backend_File)
```bash
cd backend_File
npm install
# Configurar .env con variables de BD y JWT
cp .env.example .env  # O crear manualmente
# Importar esquema SQL
mysql -u [usuario] -p [base_datos] < sql/DDL.sql
npm start  # o nodemon app.js para desarrollo
```

### Frontend (T38-frontend)
```bash
cd T38-frontend
npm install
ng serve  # Servidor de desarrollo en http://localhost:4200
```

### Configuración .env (Backend)
```env
DB_HOST=localhost
DB_USER=tu_usuario_mysql
DB_Name=autolote_db
DB_PASSWORD=tu_password
JWT_SECRETKEY=tu_clave_secreta_jwt
PORT=3000
THIRD_PARTY_API_BASE_URL=https://fakestoreapi.com/products
```

### Inicio de la Aplicación
1. Iniciar backend: `cd backend_File && npm start`
2. Iniciar frontend: `cd T38-frontend && ng serve`
3. Acceder a `http://localhost:4200` y hacer login

---

**Desarrollado por Grupo 4 - CEUTEC** 🎓
