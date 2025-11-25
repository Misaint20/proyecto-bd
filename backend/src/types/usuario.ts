import { Prisma } from '../generated/prisma/client';

type UsuarioCreateInput = Prisma.UsuarioCreateInput;

export interface CreateUsuarioData extends Omit<UsuarioCreateInput, 'id_usuario' | 'Rol' | 'activo'> {
    // id_rol lo manejaremos directamente como string
    id_rol: string;
    activo?: boolean; // Opcional, por defecto true
}

export interface UpdateUsuarioData extends Partial<CreateUsuarioData> { }

export type UserWithRole = Prisma.UsuarioGetPayload<{
    include: { Rol: true };
}>;

export type AuthenticatedUser = Omit<UserWithRole, 'password'>;