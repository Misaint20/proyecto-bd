import api from "@/lib/apiClient";

const API_REPORTES_URL = "/api/reportes";

export interface InventarioValorizadoReport {
    valor_total_inventario: number;
    detalles: Array<{
        numero_lote: string;
        vino: string;
        ubicacion: string;
        stock: number;
        precio_unitario: number;
        valor_stock_lote: number;
    }>;
}

export interface VentasPeriodoReport {
    periodo: string;
    numero_transacciones: number;
    total_ingresos: number;
    total_botellas_vendidas: number;
    detalles_ventas: Array<{
        id_venta: string;
        fecha: string | Date;
        total: number;
        cliente: string;
    }>;
}

export interface VentasMesActualReport {
    mes_actual: {
        total_ventas: number;
        total_botellas: number;
        numero_transacciones: number;
    };
    mes_anterior: {
        total_ventas: number;
        total_botellas: number;
        numero_transacciones: number;
    };
    cambio_porcentaje: number;
    cambio_botellas_porcentaje: number;
}

export async function getInventarioValorizado() {
    try {
        return await api.get<InventarioValorizadoReport>(`${API_REPORTES_URL}/inventario`);
    } catch (error) {
        console.error("Error al obtener inventario valorizado:", error);
        return {
            success: false,
            errorMessage: "Error al obtener inventario valorizado"
        }
    }
}

export async function getVentasPorPeriodo(startDate: string, endDate: string) {
    try {
        return await api.get<VentasPeriodoReport>(`${API_REPORTES_URL}/periodo?start=${startDate}&end=${endDate}`);
    } catch (error) {
        console.error("Error al obtener reporte de ventas:", error);
        return {
            success: false,
            errorMessage: "Error al obtener reporte de ventas"
        }
    }
}

export async function getVentasMesActual() {
    try {
        return await api.get<VentasMesActualReport>(`${API_REPORTES_URL}/mes-actual`);
    } catch (error) {
        console.error("Error al obtener ventas del mes actual:", error);
        return {
            success: false,
            errorMessage: "Error al obtener ventas del mes actual"
        }
    }
}
