import { Router } from 'express';
import { loginController } from '../controllers/AuthController';

const router = Router();

// Endpoint de inicio de sesión
router.post('/login', loginController);

export default router;