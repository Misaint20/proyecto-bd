export interface DetalleVentaItem {
    id_vino: string; 
    id_lote: string; 
    cantidad: number; 
}

export interface Venta {
    id_venta: string;
    fecha_venta: string | Date;
    cliente: string;
    total: string | number ;
    detalles?: {
        id_vino: string;
        id_lote: string;
        cantidad: number;
    }[];
    Detalle_Venta?: Array<{
        id_detalle?: string;
        id_vino: string;
        id_lote?: string;
        cantidad: number;
        precio_unitario: number;
        subtotal: string | number;
        Vino?: {
            nombre: string;
            tipo: string;
        };
    }>;
}

export interface ItemCarrito{
    id_vino: string
    id_lote: string
    nombreVino: string
    precio_unitario: number
    cantidad: number
    subtotal: number
}