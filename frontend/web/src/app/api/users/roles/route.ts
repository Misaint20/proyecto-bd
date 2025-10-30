import { NextRequest, NextResponse } from 'next/server';
import { getAuthHeaders } from '@/services/AuthHeaders';

const BACKEND_URL = process.env.BACKEND_URL;

export const GET = async (req: NextRequest) => {
    try {
        const response = await fetch(`${BACKEND_URL}/api/usuarios/roles/ids`, {
            method: 'GET',
            headers: await getAuthHeaders(req)
        });

        if (!response.ok) {
            return NextResponse.json({ message: 'Error al obtener roles' }, { status: response.status });
        }

        const data = await response.json();

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ message: 'Error al obtener roles' }, { status: 500 });
    }
};