import { Request, Response, NextFunction } from 'express';
import * as UsuarioService from '../services/UsuarioService';
import { HttpError } from '../middlewares/ErrorHandler';

// Endpoint para crear un nuevo usuario
export const createUsuario = async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body;

    console.log('Creando usuario:', data);
    
    // Validación básica
    if (!data.username ||!data.password ||!data.confirmPassword ||!data.id_rol ||!data.nombre ||!data.email) {
        return next(new HttpError('Faltan campos obligatorios (username, password, id_rol, nombre, email).', 400));
    }

    if(data.password !== data.confirmPassword) {
        return next(new HttpError('Las contraseñas no coinciden.', 400));
    }
    
    try {
        const nuevoUsuario = await UsuarioService.createUser(data);
        
        // No devolver la contraseña hasheada en la respuesta
        const { password,...usuarioSeguro } = nuevoUsuario; 
        
        return res.status(201).json({ message: 'Usuario creado exitosamente.', data: usuarioSeguro });
    } catch (error) {
        if (error instanceof Error && error.message.includes('en uso')) {
            return next(new HttpError(error.message, 409)); // 409 Conflict
        }
        next(error);
    }
};

// Endpoint para obtener todos los usuarios (para administración)
export const getUsuarios = async (req: Request, res: Response, next: NextFunction) => {
    // NOTA: Esta ruta debe estar protegida por un middleware de autenticación/autorización (Rol: Administrador)
    try {
        const usuarios = await UsuarioService.findAllUsers();
        // Omitir contraseñas antes de enviar
        const usuariosSeguros = usuarios.map(({ password,...user }) => user); 
        return res.status(200).json({ data: usuariosSeguros });
    } catch (error) {
        next(error);
    }
};