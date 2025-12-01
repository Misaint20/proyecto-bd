// src/routes/VentasRoutes.ts
import { Router } from 'express';
import * as VentasController from '../controllers/VentasController';
import { authenticateJWT } from '../middlewares/AuthMiddleware';
import { authorizeRoles } from '../middlewares/RoleMiddleware';
import { Rol_nombre as RolNombre } from '../generated/prisma/client';

const router = Router();

// Aplicar autenticación JWT a todas las rutas de Ventas
router.use(authenticateJWT); 

// Registro de Venta (Transacción Crítica)
// Actor: Vendedor, Encargado de Bodega, Administrador
router.post('/registrar', authorizeRoles(RolNombre.Vendedor), VentasController.registerVenta);

// Obtener todas las ventas (Acceso para reportes)
router.get('/', authorizeRoles(RolNombre.Vendedor), VentasController.getVentas);
// Obtener una venta especifica con detalles
router.get('/:id', authorizeRoles(RolNombre.Vendedor), VentasController.getVentaById);

// Eliminar una venta (Acceso para reportes)
router.delete('/:id', authorizeRoles(RolNombre.Administrador), VentasController.deleteVenta);

export default router;
