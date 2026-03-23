CREATE DATABASE IF NOT EXISTS autolote_db;
USE autolote_db;

-- 1. Tabla Usuarios
CREATE TABLE `Usuarios` (
  `Id` INT NOT NULL AUTO_INCREMENT,
  `Nombre` VARCHAR(100) NOT NULL,
  `Correo` VARCHAR(100) NOT NULL UNIQUE,
  `Password` VARCHAR(255) NOT NULL,
  `Rol` ENUM('ADMIN', 'VENDEDOR') NOT NULL,
  PRIMARY KEY (`Id`)
);

-- 2. Tabla Vehiculos
CREATE TABLE `Vehiculos` (
  `Id` INT NOT NULL AUTO_INCREMENT,
  `Marca` VARCHAR(80) NOT NULL,
  `Modelo` VARCHAR(80) NOT NULL,
  `Anio` YEAR NOT NULL,
  `Precio` DECIMAL(12,2) NOT NULL,
  `Disponibilidad` ENUM('DISPONIBLE', 'NO DISPONIBLE') NOT NULL DEFAULT 'DISPONIBLE',
  PRIMARY KEY (`Id`)
);

-- 4. Tabla Clientes
CREATE TABLE `Clientes` (
  `Id` INT NOT NULL AUTO_INCREMENT,
  `Nombre` VARCHAR(100) NOT NULL,
  `Apellido` VARCHAR(100) NOT NULL,
  `Correo` VARCHAR(100) NOT NULL UNIQUE,
  `Telefono` VARCHAR(20),
  `Direccion` TEXT,
  PRIMARY KEY (`Id`)
);

-- 5. Tabla Consultas
CREATE TABLE `Consultas` (
  `Id` INT NOT NULL AUTO_INCREMENT,
  `ClienteId` INT NOT NULL,
  `VehiculoId` INT NOT NULL,
  `Mensaje` TEXT NOT NULL,
  `FechaConsulta` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`),
  CONSTRAINT `FK_Consulta_Cliente` FOREIGN KEY (`ClienteId`) REFERENCES `Clientes` (`Id`) ON DELETE CASCADE,
  CONSTRAINT `FK_Consulta_Vehiculo` FOREIGN KEY (`VehiculoId`) REFERENCES `Vehiculos` (`Id`) ON DELETE CASCADE
);

-- 6. Tabla Ventas
CREATE TABLE `Ventas` (
  `Id` INT NOT NULL AUTO_INCREMENT,
  `ClienteId` INT NOT NULL,
  `VehiculoId` INT NOT NULL,
  `VendedorId` INT NOT NULL,
  `FechaVenta` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `PrecioTotal` DECIMAL(12,2) NOT NULL,
  `Impuestos` DECIMAL(12,2) NOT NULL,
  PRIMARY KEY (`Id`),
  CONSTRAINT `FK_Venta_Cliente` FOREIGN KEY (`ClienteId`) REFERENCES `Clientes` (`Id`),
  CONSTRAINT `FK_Venta_Vehiculo` FOREIGN KEY (`VehiculoId`) REFERENCES `Vehiculos` (`Id`),
  CONSTRAINT `FK_Venta_Vendedor` FOREIGN KEY (`VendedorId`) REFERENCES `Usuarios` (`Id`)
);

-- 1. Usuarios (Nuevos nombres para el equipo)
INSERT INTO `Usuarios` (`Nombre`, `Correo`, `Password`, `Rol`) VALUES
('Andrea Zuniga', 'andrea.z@autolote.com', 'admin123', 'ADMIN'),
('Roberto Mejia', 'roberto.m@autolote.com', 'ventas01', 'VENDEDOR'),
('Elena Castellanos', 'elena.c@autolote.com', '12345', 'VENDEDOR');

-- 2. Vehiculos (Datos de prueba)
INSERT INTO `Vehiculos` (`Marca`, `Modelo`, `Anio`, `Precio`, `Disponibilidad`) VALUES
('Toyota', 'Hilux', 2022, 35000.00, 'DISPONIBLE'),
('Honda', 'Civic', 2018, 15500.00, 'DISPONIBLE'),
('Ford', 'Ranger', 2021, 28000.00, 'NO DISPONIBLE');

-- 3. Clientes
INSERT INTO `Clientes` (`Nombre`, `Apellido`, `Correo`, `Telefono`, `Direccion`) VALUES
('Juan', 'Perez', 'juan.perez@email.com', '9988-7766', 'Col. Kennedy, Tegucigalpa'),
('Maria', 'Rodriguez', 'maria.ro@email.com', '3322-1100', 'Res. El Trapiche, Tegucigalpa'),
('Luis', 'Martinez', 'luis.mtz@email.com', '8844-5522', 'Valle de Angeles');

-- 4. Consultas
INSERT INTO `Consultas` (`ClienteId`, `VehiculoId`, `Mensaje`) VALUES
(1, 1, '¿Cuál es el kilometraje de la Hilux?'),
(2, 2, 'Deseo agendar una prueba de manejo para el Civic.'),
(3, 1, '¿Aceptan cambios por otros vehículos?');

-- 5. Ventas (Asignadas a los nuevos vendedores)
-- Usamos el Id de los usuarios (2 o 3) como VendedorId
INSERT INTO `Ventas` (`ClienteId`, `VehiculoId`, `VendedorId`, `PrecioTotal`, `Impuestos`) VALUES
(1, 3, 2, 28000.00, 4200.00),
(2, 2, 3, 15500.00, 2325.00),
(3, 1, 2, 35000.00, 5250.00);


CREATE USER 'Grupo_4'@'localhost' IDENTIFIED BY 'abc123';
GRANT ALL PRIVILEGES ON autolote_db.* TO 'Grupo_4'@'localhost';
FLUSH PRIVILEGES;