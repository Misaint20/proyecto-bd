import { Router } from 'express';
import { loginController, getCurrentUserController } from '../controllers/AuthController';

const router = Router();

// Endpoint de inicio de sesión
router.post('/login', loginController);

// Obtener usuario actual logueado
// Se expone como GET para que proxies y clientes puedan pedir el usuario actual
router.get('/me', getCurrentUserController);

export default router;