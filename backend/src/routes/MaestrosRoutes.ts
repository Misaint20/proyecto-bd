import { Router } from 'express';
import * as MaestrosController from '../controllers/MaestrosController';
import { authenticateJWT } from '../middlewares/AuthMiddleware';
import { authorizeRoles } from '../middlewares/RoleMiddleware';
import { Rol_nombre as RolNombre } from '@prisma/client';

const router = Router();

router.use(authenticateJWT)

// Rutas CRUD para la gestión de viñedos (RF01)
router.post('/vinedos', authorizeRoles(RolNombre.Encargado_de_Bodega), MaestrosController.createVinedo);
router.get('/vinedos', MaestrosController.getVinedos);
router.patch('/vinedos/:id', authorizeRoles(RolNombre.Encargado_de_Bodega), MaestrosController.updateVinedo);
router.delete('/vinedos/:id', authorizeRoles(RolNombre.Encargado_de_Bodega), MaestrosController.deleteVinedo);

// Rutas CRUD para la gestión de varietales (RF01)
router.post('/varietales', authorizeRoles(RolNombre.Encargado_de_Bodega), MaestrosController.createVarietal);
router.get('/varietales', MaestrosController.getVarietales);
router.patch('/varietales/:id', authorizeRoles(RolNombre.Encargado_de_Bodega), MaestrosController.updateVarietal);
router.delete('/varietales/:id', authorizeRoles(RolNombre.Encargado_de_Bodega), MaestrosController.deleteVarietal);

// Rutas CRUD para la gestión de barricas (RF01)
router.post('/barricas', authorizeRoles(RolNombre.Encargado_de_Bodega), MaestrosController.createBarrica);
router.get('/barricas', MaestrosController.getBarricas);
router.patch('/barricas/:id', authorizeRoles(RolNombre.Encargado_de_Bodega), MaestrosController.updateBarrica);
router.delete('/barricas/:id', authorizeRoles(RolNombre.Encargado_de_Bodega), MaestrosController.deleteBarrica);

// Rutas CRUD para la gestión de mezclas de vino (RF01)
router.post('/mezcla-vino', authorizeRoles(RolNombre.Encargado_de_Bodega), MaestrosController.createMezclaVino);
router.get('/mezcla-vino', MaestrosController.getMezclasVino);
router.delete('/mezcla-vino/:id', authorizeRoles(RolNombre.Encargado_de_Bodega), MaestrosController.deleteMezclaVino);

export default router;