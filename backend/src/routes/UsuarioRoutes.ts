import { Router } from 'express';
import * as UsuarioController from '../controllers/UsuarioController';
import * as UsuarioService from '../services/UsuarioService';
import { authenticateJWT } from '../middlewares/AuthMiddleware';
import { authorizeRoles } from '../middlewares/RoleMiddleware';
import { Rol_nombre as RolNombre } from '@prisma/client';


const router = Router();
// router.use(authenticateJWT);
// router.use(authorizeRoles(RolNombre.Administrador));

// Endpoint para crear un nuevo usuario (solo para el Administrador, o registro inicial)
router.post('/', UsuarioController.createUsuario);

// Endpoint para obtener todos los usuarios (requiere autenticación y Rol: Administrador)
router.get('/', UsuarioController.getUsuarios);

// Ruta auxiliar para obtener los IDs de los roles (Útil para el frontend o pruebas)
router.get('/roles/ids', async (req, res, next) => {
    try {
        const roles = await UsuarioService.getRoles();
        res.json(roles);
    } catch (error) {
        next(error);
    }
});

export default router;