import { Router } from 'express';
import * as VinoController from '../controllers/VinoController';
import { authenticateJWT } from '../middlewares/AuthMiddleware';
import { authorizeRoles } from '../middlewares/RoleMiddleware';
import { Rol_nombre as RolNombre } from '../generated/prisma/client';

const router = Router();

router.use(authenticateJWT)

// Rutas CRUD para la gestión de vinos (RF01)
router.get('/', VinoController.getVinos);
router.get('/:id', VinoController.getVinoById);
router.post('/', authorizeRoles(RolNombre.Encargado_de_Bodega), VinoController.createVino);
router.patch('/:id', authorizeRoles(RolNombre.Encargado_de_Bodega), VinoController.updateVino);
router.delete('/:id', authorizeRoles(RolNombre.Encargado_de_Bodega), VinoController.deleteVino);

export default router;