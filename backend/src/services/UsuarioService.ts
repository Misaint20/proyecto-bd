import prisma from '../lib/PrismaService';
import { Usuario, Rol, Rol_nombre } from '../generated/prisma/client';
import { CreateUsuarioData, UpdateUsuarioData, UserWithRole, AuthenticatedUser } from '../types/usuario';
import { generateUuid } from '../lib/IdGenerator';
import { hashPassword, verifyPassword } from '../lib/Password';
import { Prisma } from '../generated/prisma/client';


export const findRoleByName = async (nombre: Rol_nombre): Promise<Rol | null> => {
    return prisma.rol.findUnique({
        where: { nombre },
    });
};

export const getRoleIdByName = async (nombre: Rol_nombre): Promise<string> => {
    const rol = await findRoleByName(nombre);
    if (!rol) {
        throw new Error(`El rol '${nombre}' no existe en la base de datos. Ejecute init.sql.`);
    }
    return rol.id_rol;
};

export const findUserByUsername = async (username: string): Promise<Usuario | null> => {
    return prisma.usuario.findUnique({
        where: { username },
        include: { Rol: true }, // Incluye el rol para la autorización
    });
};

export const createUser = async (data: CreateUsuarioData): Promise<Usuario> => {
    
    // 1. Hashear la contraseña (RNF04)
    const hashedPassword = await hashPassword(data.password);
    
    // 2. Generar el ID y preparar la data
    const newId = generateUuid();
    
    const userData = {
        id_usuario: newId,
        id_rol: data.id_rol,
        nombre: data.nombre,
        username: data.username,
        email: data.email,
        password: hashedPassword,
        activo: data.activo ?? true, // Por defecto activo es true
    };
    
    try {
        // 3. Crear el usuario
        return await prisma.usuario.create({
            data: userData,
        });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            throw new Error('El nombre de usuario o email ya está en uso.');
        }
        throw error;
    }
};

export const findAllUsers = async () => {
    return prisma.usuario.findMany({
        include: { Rol: true },
    });
};

export const findUserById = async (id: string) => {
    return prisma.usuario.findUnique({
        where: { id_usuario: id },
        include: { Rol: true },
    });
};

/**
 * Valida las credenciales de un usuario (username y password).
 */
export const validateUserCredentials = async (username: string, pass: string): Promise<AuthenticatedUser | null> => {
    
    // Usamos UserWithRole como el tipo esperado para la consulta
    const user: UserWithRole | null = await prisma.usuario.findUnique({
        where: { username },
        include: { Rol: true }, // Incluimos la relación Rol
    });

    if (user && user.activo) {
        const isMatch = await verifyPassword(pass, user.password); // Compara la contraseña hasheada con la contraseña de entrada (RNF04)
        
        if (isMatch) {
            // Destructuramos para omitir la contraseña
            // El resultado sigue siendo tipado como AuthenticatedUser
            const { password,...result } = user;
            
            return result; // Retornamos el objeto, que ahora incluye Rol.
        }
    }
    return null; // Credenciales inválidas o usuario inactivo
};

export const getRoles = async () => {
    return prisma.rol.findMany();
};

export const updateUser = async (id: string, data: UpdateUsuarioData): Promise<Usuario> => {
    try {
        return await prisma.usuario.update({
            where: { id_usuario: id },
            data: data as any,
        });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            throw new Error('Usuario no encontrado para actualizar.');
        }
        throw error;
    }
};

export const deleteUser = async (id: string): Promise<Usuario> => {
    try {
        return await prisma.usuario.delete({
            where: { id_usuario: id },
        });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            throw new Error('Usuario no encontrado para eliminar.');
        }
        throw error;
    }
};