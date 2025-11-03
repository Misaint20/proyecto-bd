import { NextRequest, NextResponse } from 'next/server';
import { getAuthHeaders } from '@/services/AuthHeaders';

const BACKEND_URL = process.env.BACKEND_URL;

interface Context {
    params: { id: string };
}

export const PATCH = async (req: NextRequest, { params }: Context ) => {
    const { id } = await params;
    try {
        const body = await req.json();
        const response = await fetch(`${BACKEND_URL}/api/inventario/${id}`, {
            method: 'PATCH',
            headers: await getAuthHeaders(req),
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            return NextResponse.json({ message: 'Error al actualizar inventario' }, { status: response.status });
        }

        const data = await response.json();

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ message: 'Error al actualizar inventario' }, { status: 500 });
    }
};

export const DELETE = async (req: NextRequest, { params }: Context) => {
    const { id } = await params;
    try {        
        const response = await fetch(`${BACKEND_URL}/api/inventario/${id}`, {
            method: 'DELETE',
            headers: await getAuthHeaders(req)
        });

        if (!response.ok) {
            return NextResponse.json({ message: 'Error al eliminar inventario' }, { status: response.status });
        }

        const data = await response.json();

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ message: 'Error al eliminar inventario' }, { status: 500 });
    }
};