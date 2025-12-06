# Dependencias del Backend

Este documento describe las principales dependencias utilizadas en el backend del proyecto.

## Dependencias de Producción

### Runtime y Framework

#### Node.js
[Node.js](https://nodejs.org/es/) es un entorno de ejecución de JavaScript de código abierto y multiplataforma que ejecuta código JavaScript fuera de un navegador web. Es la base sobre la cual se construye todo el backend.

**Versión requerida:** 22.x o superior

#### Express.js (v5.1.0)
[Express](https://expressjs.com/) es un framework web minimalista y flexible para Node.js que proporciona un conjunto robusto de características para aplicaciones web y móviles. Se utiliza para:
- Manejo de rutas HTTP
- Middleware para procesar peticiones
- Gestión de respuestas y errores
- API RESTful

#### TypeScript (v5.9.3)
[TypeScript](https://www.typescriptlang.org/) es un superconjunto tipado de JavaScript que compila a JavaScript limpio. Proporciona:
- Tipado estático para prevenir errores
- Mejor autocompletado en IDEs
- Refactorización más segura
- Mejor mantenibilidad del código

### Base de Datos

#### Prisma (v7.0.0)
[Prisma](https://www.prisma.io/) es un ORM (Object-Relational Mapping) moderno para Node.js y TypeScript. Características:
- Generación automática de cliente TypeScript type-safe
- Migraciones de base de datos
- Introspección de esquemas
- Prisma Studio para visualización de datos

**Componentes utilizados:**
- `@prisma/client` - Cliente generado para interactuar con la base de datos
- `@prisma/adapter-mariadb` - Adaptador específico para MariaDB
- `prisma` (dev) - CLI para migraciones y generación de cliente

#### MySQL2 (v3.15.3)
[MySQL2](https://www.npmjs.com/package/mysql2) es un driver de MySQL para Node.js con soporte para:
- Consultas preparadas
- Conexiones pool
- Promesas
- Compatible con MySQL y MariaDB

### Autenticación y Seguridad

#### bcrypt (v6.0.0)
[bcrypt](https://www.npmjs.com/package/bcrypt) es una biblioteca para el hashing de contraseñas. Utiliza el algoritmo bcrypt para:
- Hash seguro de contraseñas
- Verificación de contraseñas
- Protección contra ataques de fuerza bruta mediante salt rounds

#### jsonwebtoken (v9.0.2)
[jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) implementa JSON Web Tokens (JWT) para:
- Autenticación de usuarios
- Tokens de sesión
- Verificación de identidad sin estado

### Configuración y Variables de Entorno

#### dotenv (v17.2.3)
[dotenv](https://www.npmjs.com/package/dotenv) es un módulo de cero dependencias que carga variables de entorno desde un archivo `.env` a `process.env`. Permite:
- Configuración separada del código
- Diferentes configuraciones por entorno
- Gestión segura de credenciales

### Logging

#### Morgan (v1.10.1)
[Morgan](https://www.npmjs.com/package/morgan) es un middleware de logging de peticiones HTTP para Node.js. Características:
- Registro automático de peticiones HTTP
- Formatos predefinidos (combined, common, dev, etc.)
- Información de tiempo de respuesta
- Códigos de estado HTTP

#### Winston (v3.18.3)
[Winston](https://www.npmjs.com/package/winston) es una biblioteca de logging asíncrono multi-transporte. Proporciona:
- Múltiples niveles de log (error, warn, info, debug)
- Múltiples destinos (archivo, consola, servicios externos)
- Formato personalizable
- Rotación de logs

#### winston-daily-rotate-file (v5.0.0)
[winston-daily-rotate-file](https://www.npmjs.com/package/winston-daily-rotate-file) es un transporte para Winston que:
- Rota archivos de log diariamente
- Limita el tamaño de archivos
- Elimina logs antiguos automáticamente
- Comprime logs antiguos

### Middleware y Utilidades

#### CORS (v2.8.5)
[cors](https://www.npmjs.com/package/cors) es un middleware de Express para habilitar CORS (Cross-Origin Resource Sharing). Permite:
- Peticiones desde el frontend en diferente dominio
- Configuración de orígenes permitidos
- Control de headers y métodos HTTP

#### cookie (v1.0.2)
[cookie](https://www.npmjs.com/package/cookie) proporciona funciones para parsear y serializar cookies HTTP:
- Manejo de cookies de sesión
- Cookies seguras y HttpOnly
- Configuración de expiración

#### uuid (v13.0.0)
[uuid](https://www.npmjs.com/package/uuid) genera identificadores únicos universales (UUID). Se utiliza para:
- IDs únicos de registros en la base de datos
- Tokens de sesión
- Identificadores de transacciones

## Dependencias de Desarrollo

### TypeScript y Tipos

#### @types/node (v24.10.1)
Definiciones de tipos TypeScript para Node.js API.

#### @types/express (v5.0.5)
Definiciones de tipos TypeScript para Express.

#### @types/cors (v2.8.19)
Definiciones de tipos TypeScript para CORS.

#### @types/bcrypt (v6.0.0)
Definiciones de tipos TypeScript para bcrypt.

#### @types/jsonwebtoken (v9.0.10)
Definiciones de tipos TypeScript para jsonwebtoken.

#### @types/morgan (v1.9.10)
Definiciones de tipos TypeScript para Morgan.

#### @types/uuid (v11.0.0)
Definiciones de tipos TypeScript para uuid.

### Herramientas de Desarrollo

#### ts-node (v10.9.2)
[ts-node](https://www.npmjs.com/package/ts-node) ejecuta TypeScript directamente en Node.js sin precompilación.

#### ts-node-dev (v2.0.0)
[ts-node-dev](https://www.npmjs.com/package/ts-node-dev) es una herramienta de desarrollo que:
- Reinicia automáticamente el servidor cuando detecta cambios
- Compila TypeScript al vuelo
- Más rápido que nodemon + ts-node
- Ideal para desarrollo

## Arquitectura de Dependencias

```
Express.js (Framework web)
├── Morgan (Logging HTTP)
├── CORS (Cross-origin requests)
├── cookie (Manejo de cookies)
└── Rutas
    ├── jsonwebtoken (Autenticación)
    ├── bcrypt (Seguridad)
    └── Prisma Client (Base de datos)
        ├── MySQL2 (Driver)
        └── MariaDB Adapter

Winston (Logging aplicación)
└── winston-daily-rotate-file (Rotación de logs)

dotenv (Configuración)
```

## Comandos de Gestión

Para instalar todas las dependencias:
```bash
npm install
```

Para actualizar dependencias:
```bash
npm update
```

Para verificar dependencias obsoletas:
```bash
npm outdated
```

Para auditar vulnerabilidades de seguridad:
```bash
npm audit
```

## Notas de Versiones

- Se utiliza **Express 5.x** (última versión mayor)
- **Prisma 7.x** incluye mejoras de rendimiento y nuevas características
- **React 19** y **Next.js 16** requieren Node.js 18 o superior
- **bcrypt 6.x** tiene mejoras de seguridad importantes
- Todas las dependencias se mantienen actualizadas regularmente
