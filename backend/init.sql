CREATE DATABASE IF NOT EXISTS Bodega;
USE Bodega;

CREATE TABLE IF NOT EXISTS Rol (
    id_rol VARCHAR(36) PRIMARY KEY,
    nombre ENUM('Administrador', 'Encargado de Bodega', 'Enologo/Productor', 'Vendedor') NOT NULL UNIQUE,
    descripcion TEXT
);

CREATE TABLE IF NOT EXISTS Usuario (
    id_usuario VARCHAR(36) PRIMARY KEY,
    id_rol VARCHAR(36) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL, 
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_rol) REFERENCES Rol(id_rol)
);

CREATE TABLE IF NOT EXISTS Vinedo (
    id_vinedo VARCHAR(36) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    ubicacion VARCHAR(200) NOT NULL,
    contacto VARCHAR(100) NOT NULL,
    telefono VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS Varietal (
    id_varietal VARCHAR(36) PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT
);

CREATE TABLE IF NOT EXISTS Barrica (
    id_barrica VARCHAR(36) PRIMARY KEY,
    tipo_madera ENUM('Frances', 'Americano', 'Mixto') NOT NULL,
    capacidad_litros INT NOT NULL,
    fecha_compra DATE NOT NULL,
    costo DECIMAL(10, 2) NOT NULL
);

CREATE TABLE IF NOT EXISTS Vino (
    id_vino VARCHAR(36) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    tipo ENUM('Tinto', 'Blanco', 'Rosado', 'Espumoso') NOT NULL,
    anio_cosecha INT NOT NULL,
    precio_botella DECIMAL(10, 2) NOT NULL,
    botellas_por_caja INT DEFAULT 12,
    meses_barrica INT DEFAULT 0,
    descripcion TEXT
);

CREATE TABLE IF NOT EXISTS Cosecha (
    id_cosecha VARCHAR(36) PRIMARY KEY,
    id_vinedo VARCHAR(36) NOT NULL,
    anio INT NOT NULL,
    cantidad_kg DECIMAL(10, 2) NOT NULL,
    fecha_cosecha DATE NOT NULL,
    FOREIGN KEY (id_vinedo) REFERENCES Vinedo(id_vinedo)
);

CREATE TABLE IF NOT EXISTS Lote (
    id_lote VARCHAR(36) PRIMARY KEY,
    id_vino VARCHAR(36) NOT NULL,
    id_barrica VARCHAR(36) NULL,
    id_cosecha VARCHAR(36) NOT NULL,
    fecha_embotellado DATE NOT NULL,
    cantidad_botellas INT NOT NULL,
    numero_lote VARCHAR(50) NOT NULL UNIQUE,
    FOREIGN KEY (id_vino) REFERENCES Vino(id_vino) ON DELETE CASCADE,
    FOREIGN KEY (id_barrica) REFERENCES Barrica(id_barrica),
    FOREIGN KEY (id_cosecha) REFERENCES Cosecha(id_cosecha)
);

CREATE TABLE IF NOT EXISTS Inventario (
    id_inventario VARCHAR(36) PRIMARY KEY,
    id_lote VARCHAR(36) NOT NULL,
    ubicacion ENUM('Barricas', 'Oficina', 'Almacenamiento', 'Produccion') NOT NULL,
    FOREIGN KEY (id_lote) REFERENCES Lote(id_lote)
);

CREATE TABLE IF NOT EXISTS Venta (
    id_venta VARCHAR(36) PRIMARY KEY,
    fecha_venta DATE NOT NULL,
    cliente VARCHAR(200) NOT NULL
    total DECIMAL(10, 2) NOT NULL
);

CREATE TABLE IF NOT EXISTS Mezcla_Vino (
    id_mezcla VARCHAR(36) PRIMARY KEY,
    id_vino VARCHAR(36) NOT NULL,
    id_varietal VARCHAR(36) NOT NULL,
    porcentaje DECIMAL(5, 2) NOT NULL,
    FOREIGN KEY (id_vino) REFERENCES Vino(id_vino) ON DELETE CASCADE,
    FOREIGN KEY (id_varietal) REFERENCES Varietal(id_varietal),
    UNIQUE KEY idx_unique_mezcla (id_vino, id_varietal)
);

CREATE TABLE IF NOT EXISTS Detalle_Venta (
    id_detalle VARCHAR(36) PRIMARY KEY,
    id_venta VARCHAR(36) NOT NULL,
    id_vino VARCHAR(36) NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (id_venta) REFERENCES Venta(id_venta) ON DELETE CASCADE,
    FOREIGN KEY (id_vino) REFERENCES Vino(id_vino)
);

CREATE TABLE IF NOT EXISTS Proceso_Produccion (
    id_proceso VARCHAR(36) PRIMARY KEY,
    id_lote VARCHAR(36) NOT NULL,
    nombre_proceso VARCHAR(100) NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE,
    descripcion TEXT,
    id_barrica VARCHAR(36) NULL,
    FOREIGN KEY (id_lote) REFERENCES Lote(id_lote),
    FOREIGN KEY (id_barrica) REFERENCES Barrica(id_barrica)
);

CREATE TABLE IF NOT EXISTS Control_Calidad (
    id_control VARCHAR(36) PRIMARY KEY,
    id_proceso VARCHAR(36) NOT NULL,
    fecha_analisis DATE NOT NULL,
    tipo_control ENUM('Analisis', 'Cata') NOT NULL,
    resultados TEXT,
    FOREIGN KEY (id_proceso) REFERENCES Proceso_Produccion(id_proceso)
);

SET @ADMIN_ID = UUID();
SET @BODEGA_ID = UUID();
SET @ENOLOGO_ID = UUID();
SET @VENDEDOR_ID = UUID();

-- Inserción de roles base
INSERT IGNORE INTO Rol (id_rol, nombre, descripcion) VALUES
(@ADMIN_ID, 'Administrador', 'Acceso total y gestión de usuarios.'),
(@BODEGA_ID, 'Encargado de Bodega', 'Control de inventario y recepcion de mercancia (RF01).'),
(@ENOLOGO_ID, 'Enologo/Productor', 'Supervision del proceso productivo y calidad (RF02).'),
(@VENDEDOR_ID, 'Vendedor', 'Atencion a clientes y registro de ventas (RF03).');