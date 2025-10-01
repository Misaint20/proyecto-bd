import prisma from '../lib/PrismaService';
import { Usuario, Rol, Rol_nombre } from '@prisma/client';
import { CreateUsuarioData, UpdateUsuarioData } from '../types/usuario';
import { generateUuid } from '../lib/IdGenerator';
import { hashPassword } from '../lib/Password';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';


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
        if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
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