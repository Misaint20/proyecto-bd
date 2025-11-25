export interface Inventario {
    id_inventario: string;
    ubicacion: string;
    cantidad_botellas: number;
    Lote: {
        id_lote: string;
        numero_lote: string;
        cantidad_botellas: number;
        Vino: {
            id_vino: string;
            nombre: string;
            tipo: string;
            anio_cosecha: number;
            precio_botella: number;
            botellas_por_caja: number;
        }
    };
}