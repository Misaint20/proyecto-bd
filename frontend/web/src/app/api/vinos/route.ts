import { NextRequest, NextResponse } from 'next/server';
import { getAuthHeaders } from '@/services/AuthHeaders';

const BACKEND_URL = process.env.BACKEND_URL;

export const GET = async (req: NextRequest) => {
    try {
        const response = await fetch(`${BACKEND_URL}/api/vinos`, {
            method: 'GET',
            headers: await getAuthHeaders(req)
        });

        if (!response.ok) {
            return NextResponse.json({ message: 'Error al obtener vinos' }, { status: response.status });
        }

        const data = await response.json();

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ message: 'Error al obtener vinos' }, { status: 500 });
    }
};

export const POST = async (req: NextRequest) => {
    try {
        const body = await req.json();
        const response = await fetch(`${BACKEND_URL}/api/vinos`, {
            method: 'POST',
            headers: await getAuthHeaders(req),
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            return NextResponse.json({ message: 'Error al crear vino' }, { status: response.status });
        }

        const data = await response.json();

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ message: 'Error al crear vino' }, { status: 500 });
    }
};