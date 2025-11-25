import { Prisma } from '../generated/prisma/client';

export interface DetalleVentaItem {
    id_vino: string; 
    id_lote: string; 
    cantidad: number; 
}

// ----------------------------------------
// Tipos para Venta (Encabezado)
// ----------------------------------------

type VentaCreateInput = Prisma.VentaCreateInput;

export interface VentaCreationData extends Omit<VentaCreateInput, 
    'id_venta' | 
    'Detalle_Venta' |
    'total' 
> {
    // El id del vendedor se obtiene del JWT, no del cuerpo de la petición.
    fecha_venta: string;
    detalles: DetalleVentaItem[]; 
}