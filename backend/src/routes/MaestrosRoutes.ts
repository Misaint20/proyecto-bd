import { Router } from 'express';
import * as MaestrosController from '../controllers/MaestrosController';

const router = Router();

// Rutas CRUD para la gestión de viñedos (RF01)
router.post('/vinedos', MaestrosController.createVinedo);
router.get('/vinedos', MaestrosController.getVinedos);
router.patch('/vinedos/:id', MaestrosController.updateVinedo);
router.delete('/vinedos/:id', MaestrosController.deleteVinedo);

// Rutas CRUD para la gestión de varietales (RF01)
router.post('/varietales', MaestrosController.createVarietal);
router.get('/varietales', MaestrosController.getVarietales);
router.patch('/varietales/:id', MaestrosController.updateVarietal);
router.delete('/varietales/:id', MaestrosController.deleteVarietal);

// Rutas CRUD para la gestión de barricas (RF01)
router.post('/barricas', MaestrosController.createBarrica);
router.get('/barricas', MaestrosController.getBarricas);
router.patch('/barricas/:id', MaestrosController.updateBarrica);

// Rutas CRUD para la gestión de mezclas de vino (RF01)
router.post('/mezcla-vino', MaestrosController.createMezclaVino);
router.get('/mezcla-vino', MaestrosController.getMezclasVino);
router.delete('/mezcla-vino/:id', MaestrosController.deleteMezclaVino);

export default router;