import { NextRequest, NextResponse } from 'next/server';
import { getAuthHeaders } from '@/services/AuthHeaders';

const BACKEND_URL = process.env.BACKEND_URL;

interface Context {
    params: { id: string };
}

export const PATCH = async (req: NextRequest, { params }: Context ) => {
    try {
        const body = await req.json();
        const { id } = await params;
        const response = await fetch(`${BACKEND_URL}/api/vinos/${id}`, {
            method: 'PATCH',
            headers: await getAuthHeaders(req),
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            return NextResponse.json({ message: 'Error al actualizar vino' }, { status: response.status });
        }

        const data = await response.json();

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ message: 'Error al actualizar vino' }, { status: 500 });
    }
};

export const DELETE = async (req: NextRequest, context: Context) => {
    try {
        const id = context.params;
        const response = await fetch(`${BACKEND_URL}/api/vinos/${id}`, {
            method: 'DELETE',
            headers: await getAuthHeaders(req)
        });

        if (!response.ok) {
            return NextResponse.json({ message: 'Error al eliminar vino' }, { status: response.status });
        }

        const data = await response.json();

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ message: 'Error al eliminar vino' }, { status: 500 });
    }
};