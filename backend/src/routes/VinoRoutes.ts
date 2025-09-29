import { Router } from 'express';
import * as VinoController from '../controllers/VinoController';

const router = Router();

// Rutas CRUD para la gestión de vinos (RF01)
router.get('/', VinoController.getVinos);
router.get('/:id', VinoController.getVinoById);
router.post('/', VinoController.createVino);
router.delete('/:id', VinoController.deleteVino);
// router.put('/:id', VinoController.updateVino); // Faltaría implementar el update

export default router;