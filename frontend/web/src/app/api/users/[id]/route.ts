import { NextRequest, NextResponse } from 'next/server';
import { getAuthHeaders } from '@/services/AuthHeaders';

const BACKEND_URL = process.env.BACKEND_URL;

interface Context {
    params: { id: string };
}

export const PATCH = async (req: NextRequest, { params }: Context) => {
    try {
        const body = await req.json();
        const { id } = await params;
        const response = await fetch(`${BACKEND_URL}/api/users/${id}`, {
            method: 'PATCH',
            headers: await getAuthHeaders(req),
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            return NextResponse.json({ message: 'Error al actualizar usuario' }, { status: response.status });
        }

        const data = await response.json();

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ message: 'Error al actualizar usuario' }, { status: 500 });
    }
};

export const DELETE = async (req: NextRequest, { params }: Context) => {
    try {
        const { id } = await params;
        const response = await fetch(`${BACKEND_URL}/api/users/${id}`, {
            method: 'DELETE',
            headers: await getAuthHeaders(req)
        });

        if (!response.ok) {
            return NextResponse.json({ message: 'Error al eliminar usuario' }, { status: response.status });
        }

        const data = await response.json();

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ message: 'Error al eliminar usuario' }, { status: 500 });
    }
};