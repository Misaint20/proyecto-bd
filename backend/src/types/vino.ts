import { TipoVino } from "@prisma/client";

export interface CreateVinoData {
    nombre: string;
    tipo: TipoVino;
    año_cosecha: number;
    precio_botella: number;
    botellas_por_caja?: number;
    meses_barrica?: number;
    descripcion?: string;
}

export interface UpdateVinoData extends Partial<CreateVinoData> {}