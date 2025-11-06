import { Prisma, Inventario_ubicacion } from '@prisma/client';

type CreateInventarioInput = Prisma.InventarioCreateInput;

export interface CreateInventarioData extends Omit<CreateInventarioInput,
'id_inventario' | 
'Lote'
> {
    id_lote: string;
    ubicacion: Inventario_ubicacion;
    cantidad_botellas: number;
}

export interface UpdateInventarioData extends Partial<CreateInventarioData> {}