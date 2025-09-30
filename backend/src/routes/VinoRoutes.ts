import { Router } from 'express';
import * as VinoController from '../controllers/VinoController';

const router = Router();

// Rutas CRUD para la gestión de vinos (RF01)
router.get('/', VinoController.getVinos);
router.get('/:id', VinoController.getVinoById);
router.post('/', VinoController.createVino);
router.patch('/:id', VinoController.updateVino);
router.delete('/:id', VinoController.deleteVino);

export default router;