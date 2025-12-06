# Instrucciones de Inicialización del Backend

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 22 o superior)
- **npm** (viene con Node.js)
- **MySQL** (versión 8.0 o superior) o **MariaDB** (versión 10.6 o superior)
- **Git**

## Pasos de Instalación

### 1. Clonar el Repositorio

Primero, crea un fork del repositorio en tu cuenta de GitHub haciendo clic en el botón "Fork" en la parte superior derecha de la página del repositorio.

Luego, clona el repositorio en tu computadora local:

```bash
git clone https://github.com/tu-usuario/proyecto-bd.git
```

**Nota:** Reemplaza `tu-usuario` con tu nombre de usuario de GitHub.

### 2. Navegar al Directorio del Backend

```bash
cd proyecto-bd/backend
```

### 3. Instalar Dependencias

Instala todas las dependencias del proyecto usando npm:

```bash
npm install
```

### 4. Configurar la Base de Datos

#### 4.1. Iniciar el Servicio de Base de Datos

Asegúrate de que tu servicio de MySQL o MariaDB esté en ejecución:

- **MySQL (Windows):** Abre "Servicios" y busca MySQL, luego inícialo
- **MySQL (Linux/Mac):** `sudo systemctl start mysql` o `brew services start mysql`
- **MariaDB (Windows):** Abre "Servicios" y busca MariaDB, luego inícialo
- **MariaDB (Linux/Mac):** `sudo systemctl start mariadb` o `brew services start mariadb`

#### 4.2. Crear la Base de Datos y las Tablas

Ejecuta el script `init.sql` para crear la base de datos `Bodega` y todas las tablas necesarias:

```bash
mysql -u root -p < init.sql
```

**Nota:** Te pedirá la contraseña del usuario root de MySQL/MariaDB. Si no has configurado una contraseña, presiona Enter.

El archivo `init.sql` creará:
- La base de datos `Bodega`
- Todas las tablas del sistema (Rol, Usuario, Vinedo, Varietal, Barrica, Vino, Cosecha, Lote, Inventario, Venta, etc.)
- Los roles básicos del sistema (Administrador, Encargado de Bodega, Enólogo/Productor, Vendedor)

#### 4.3. (Opcional) Configurar Usuarios con Permisos Específicos

Para mayor seguridad, puedes ejecutar el script `users.sql` que crea usuarios de base de datos con permisos específicos según el rol:

```bash
mysql -u root -p < users.sql
```

**Importante:** Antes de ejecutar este script, edita el archivo `users.sql` y modifica las contraseñas en las líneas 5-9 para usar contraseñas seguras.

### 5. Configurar Variables de Entorno

Crea un archivo `.env` en el directorio `backend` con la siguiente configuración:

```env
DATABASE_URL="mysql://root:root@localhost:3306/Bodega"
```

**Formato de la URL de Conexión:**
```
mysql://USUARIO:CONTRASEÑA@HOST:PUERTO/NOMBRE_BD
```

**Ejemplos de configuración:**

- **MySQL local sin contraseña:**
  ```
  DATABASE_URL="mysql://root@localhost:3306/Bodega"
  ```

- **MySQL local con contraseña:**
  ```
  DATABASE_URL="mysql://root:tu_contraseña@localhost:3306/Bodega"
  ```

- **MariaDB local:**
  ```
  DATABASE_URL="mysql://root:tu_contraseña@localhost:3306/Bodega"
  ```
  (MariaDB usa el mismo protocolo `mysql://`)

- **Puerto diferente:**
  ```
  DATABASE_URL="mysql://root:tu_contraseña@localhost:3307/Bodega"
  ```

**Nota:** Si configuraste el usuario `app_backend` en el paso 4.3, puedes usar:
```
DATABASE_URL="mysql://app_backend:ClaveBackendSegura123@localhost:3306/Bodega"
```

### 6. Generar el Cliente de Prisma

Genera el cliente de Prisma para poder interactuar con la base de datos desde el código:

```bash
npm run prisma:generate
```

Este comando creará el cliente de Prisma basándose en el esquema de la base de datos.

### 7. Iniciar el Servidor de Desarrollo

Inicia el servidor en modo desarrollo:

```bash
npm run dev
```

El servidor debería iniciarse correctamente y estar escuchando en el puerto configurado (por defecto 3000).

## Verificación

Para verificar que todo está funcionando correctamente:

1. El servidor debería mostrar un mensaje indicando que está escuchando en el puerto correspondiente
2. No deberían aparecer errores de conexión a la base de datos
3. Puedes probar accediendo a `http://localhost:4000` (o el puerto que hayas configurado)

## Scripts Disponibles

- `npm run dev` - Inicia el servidor en modo desarrollo con recarga automática
- `npm run build` - Compila el proyecto TypeScript a JavaScript
- `npm start` - Inicia el servidor en modo producción
- `npm run prisma:generate` - Genera el cliente de Prisma
- `npm run prisma:studio` - Abre Prisma Studio para visualizar/editar datos
- `npm run prisma:migrate` - Ejecuta migraciones de Prisma

## Solución de Problemas

### Error de conexión a la base de datos

- Verifica que MySQL/MariaDB esté ejecutándose
- Confirma que las credenciales en el archivo `.env` sean correctas
- Asegúrate de que la base de datos `Bodega` exista
- Verifica que el puerto sea el correcto (por defecto 3306)

### Error en archivos TypeScript relacionados con Prisma

Si después de ejecutar `npm run prisma:generate` aparecen errores en archivos TypeScript (como `vino.ts`), es posible que necesites reiniciar tu editor de código o IDE para que detecte el cliente de Prisma recién generado. El código funcionará correctamente aunque aparezcan estos errores en el editor.

### El puerto está en uso

Si el puerto 3000 ya está en uso, puedes configurar otro puerto mediante variables de entorno en el archivo `.env`.

## Estructura de la Base de Datos

La base de datos `Bodega` contiene las siguientes tablas principales:

- **Rol** - Roles del sistema (Administrador, Encargado de Bodega, Enólogo/Productor, Vendedor)
- **Usuario** - Usuarios del sistema con sus credenciales
- **Vinedo** - Información de los viñedos proveedores
- **Varietal** - Tipos de uvas (Malbec, Cabernet Sauvignon, etc.)
- **Barrica** - Barricas de madera para añejamiento
- **Vino** - Catálogo de vinos producidos
- **Cosecha** - Registro de cosechas de uva
- **Lote** - Lotes de producción de vino
- **Inventario** - Control de stock por ubicación
- **Venta** - Registro de ventas
- **Proceso_Produccion** - Trazabilidad del proceso productivo
- **Control_Calidad** - Controles de calidad realizados

## Siguiente Paso

Una vez que el backend esté funcionando correctamente, puedes proceder a configurar el frontend siguiendo las instrucciones en `frontend/web/docs/instructions.md`.
