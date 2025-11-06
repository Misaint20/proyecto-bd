export interface Inventario {
    id_inventario: string;
    ubicacion: string;
    cantidad_botellas: number;
    Lote: {
        numero_lote: string;
        cantidad_botellas: number;
    };
}