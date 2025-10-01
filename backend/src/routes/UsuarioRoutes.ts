import { Router } from 'express';
import * as UsuarioController from '../controllers/UsuarioController';
import * as UsuarioService from '../services/UsuarioService';

const router = Router();

// Endpoint para crear un nuevo usuario (solo para el Administrador, o registro inicial)
router.post('/', UsuarioController.createUsuario);

// Endpoint para obtener todos los usuarios (requiere autenticación y Rol: Administrador)
router.get('/', UsuarioController.getUsuarios);

// Ruta auxiliar para obtener los IDs de los roles (Útil para el frontend o pruebas)
router.get('/roles/ids', async (req, res, next) => {
    try {
        const roles = await UsuarioService.findAllUsers();
        const roleMap = roles.reduce((acc, rol) => {
            acc = rol.Rol.id_rol;
            return acc;
        }, {});
        res.status(200).json(roleMap);
    } catch (error) {
        next(error);
    }
});

export default router;