-- Seguridad de Base de Datos: RNF04 - Permisos restringidos por rol
-- Ejecutar como usuario 'root' en MariaDB/MySQL

-- 1. Definición de Contraseñas Seguras y Host (REEMPLAZAR)
SET @PASS_APP_BACKEND = 'ClaveBackendSegura123';
SET @PASS_ADMIN = 'ClaveAdminDBA123';
SET @PASS_ENOLOGO = 'ClaveEnologoDBA987';
SET @PASS_VENDEDOR = 'ClaveVendedorDBA456';
SET @PASS_BODEGA = 'ClaveBodegaDBA4321';
SET @HOST = 'localhost'; -- Usar 'localhost' o el nombre del servicio nube

-- 2. Creación de Usuarios de Base de Datos y Asignación de Permisos

-- 2.1. APP_BACKEND: Cuenta principal para Prisma/Node.js
-- Necesita ALL PRIVILEGES en la base de datos 'Bodega' para ejecutar transacciones y JOINs.
-- Su aplicación Node.js utilizará esta cuenta en el archivo.env.
CREATE USER 'app_backend'@'@HOST' IDENTIFIED BY @PASS_APP_BACKEND;
GRANT ALL PRIVILEGES ON Bodega.* TO 'app_backend'@'@HOST'; 

-- 2.2. ADMINISTRADOR DE BASE DE DATOS (DBA)
CREATE USER 'admin_db'@'@HOST' IDENTIFIED BY @PASS_ADMIN;
GRANT ALL PRIVILEGES ON Bodega.* TO 'admin_db'@'@HOST';


-- ----------------------------------------------------------------------
-- CONFIGURACIÓN DE SEGURIDAD SECUNDARIA (RNF04 - Defensa en Profundidad)
-- Si la capa de la aplicación falla, estos usuarios limitan el daño.
-- ----------------------------------------------------------------------

-- 2.3. ENÓLOGO/PRODUCTOR (RF02: Trazabilidad)
CREATE USER 'enologo_db'@'@HOST' IDENTIFIED BY @PASS_ENOLOGO;

-- Permisos de LECTURA (SELECT) en todas las tablas (necesario para JOINs, FKs y Maestros)
GRANT SELECT ON Bodega.* TO 'enologo_db'@'@HOST'; 

-- Permisos de ESCRITURA/MODIFICACIÓN en tablas de Trazabilidad (RF02)
GRANT INSERT, UPDATE, DELETE ON Bodega.Cosecha TO 'enologo_db'@'@HOST';
GRANT INSERT, UPDATE, DELETE ON Bodega.Lote TO 'enologo_db'@'@HOST';
GRANT INSERT, UPDATE ON Bodega.Proceso_Produccion TO 'enologo_db'@'@HOST'; -- Se asume que DELETE lo hace el Admin
GRANT INSERT, UPDATE ON Bodega.Control_Calidad TO 'enologo_db'@'@HOST';
GRANT INSERT, DELETE ON Bodega.Mezcla_Vino TO 'enologo_db'@'@HOST'; -- Para gestionar la composición

-- 2.4. VENDEDOR (RF03: Ventas y Lectura RF01: Inventario)
CREATE USER 'vendedor_db'@'@HOST' IDENTIFIED BY @PASS_VENDEDOR;

-- Permisos de LECTURA (SELECT) en tablas de productos, maestros e inventario.
GRANT SELECT ON Bodega.* TO 'vendedor_db'@'@HOST';

-- Permisos de ESCRITURA para Ventas (RF03)
GRANT INSERT ON Bodega.Venta TO 'vendedor_db'@'@HOST';
GRANT INSERT ON Bodega.Detalle_Venta TO 'vendedor_db'@'@HOST';

-- Permisos de ESCRITURA para Inventario (Solo DEDUCCIÓN de Stock)
GRANT UPDATE ON Bodega.Inventario TO 'vendedor_db'@'@HOST'; 


-- 2.5. ENCARGADO DE BODEGA (RF01: Inventario - Entrada/Salida)
CREATE USER 'bodega_db'@'@HOST' IDENTIFIED BY @PASS_BODEGA;

-- Permisos de LECTURA (SELECT) general
GRANT SELECT ON Bodega.* TO 'bodega_db'@'@HOST';

-- Permisos de ESCRITURA para Inventario (RF01 - Entrada de Stock)
GRANT INSERT, UPDATE ON Bodega.Inventario TO 'bodega_db'@'@HOST';


-- 3. Aplicar Cambios
FLUSH PRIVILEGES;