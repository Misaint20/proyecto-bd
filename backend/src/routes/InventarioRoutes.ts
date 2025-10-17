import { Router } from 'express';
import * as InventarioController from '../controllers/InventarioController';
import { authenticateJWT } from '../middlewares/AuthMiddleware';
import { authorizeRoles } from '../middlewares/RoleMiddleware';
import { Rol_nombre as RolNombre } from '@prisma/client';

const router = Router();

// Aplicar autenticación JWT a todas las rutas de Inventario
router.use(authenticateJWT); 

// Rutas de Inventario (RF01)
// La lectura es para todos los roles que usan stock o ventas
router.get('/', InventarioController.getInventario);

// Registro/Ajuste de entrada requiere Encargado de Bodega o Admin
router.post('/entrada', authorizeRoles(RolNombre.Encargado_de_Bodega), InventarioController.registerInventoryEntry);

// La eliminación es crítica, solo para el Administrador
router.delete('/:id', authorizeRoles(RolNombre.Administrador), InventarioController.deleteInventario);

export default router;