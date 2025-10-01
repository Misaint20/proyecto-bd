import { Prisma, Rol_nombre as RolNombre } from '@prisma/client';

type UsuarioCreateInput = Prisma.UsuarioCreateInput;

export interface CreateUsuarioData extends Omit<UsuarioCreateInput, 'id_usuario' | 'Rol' | 'activo'> {
    // id_rol lo manejaremos directamente como string
    id_rol: string;
    activo?: boolean; // Opcional, por defecto true
}

export interface UpdateUsuarioData extends Partial<CreateUsuarioData> { }