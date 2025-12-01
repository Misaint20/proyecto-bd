import { NextRequest, NextResponse } from 'next/server';
import { getAuthHeaders } from '@/services/AuthHeaders';

const BACKEND_URL = process.env.BACKEND_URL;

export const GET = async (req: NextRequest) => {
    try {
        const { searchParams } = new URL(req.url);
        const startDate = searchParams.get('start');
        const endDate = searchParams.get('end');

        if (!startDate || !endDate) {
            return NextResponse.json(
                { message: 'Los parámetros start y end son requeridos' },
                { status: 400 }
            );
        }

        const response = await fetch(
            `${BACKEND_URL}/api/reportes/ventas/periodo?start=${startDate}&end=${endDate}`,
            {
                method: 'GET',
                headers: await getAuthHeaders(req)
            }
        );

        if (!response.ok) {
            return NextResponse.json(
                { message: 'Error al obtener reporte de ventas por período' },
                { status: response.status }
            );
        }

        const data = await response.json();

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { message: 'Error al obtener reporte de ventas por período' },
            { status: 500 }
        );
    }
};
