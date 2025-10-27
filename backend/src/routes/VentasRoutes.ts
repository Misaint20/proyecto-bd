// src/routes/VentasRoutes.ts
import { Router } from 'express';
import * as VentasController from '../controllers/VentasController';
import { authenticateJWT } from '../middlewares/AuthMiddleware';
import { authorizeRoles } from '../middlewares/RoleMiddleware';
import { Rol_nombre as RolNombre } from '@prisma/client';

const router = Router();

// Aplicar autenticación JWT a todas las rutas de Ventas
router.use(authenticateJWT); 

// Registro de Venta (Transacción Crítica)
// Actor: Vendedor, Encargado de Bodega, Administrador
router.post('/registrar', authorizeRoles(RolNombre.Vendedor), VentasController.registerVenta);

// Obtener todas las ventas (Acceso para reportes)
router.get('/', authorizeRoles(RolNombre.Administrador), VentasController.getVentas);


export default router;