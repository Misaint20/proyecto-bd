import { NextRequest, NextResponse } from 'next/server';

// URL de tu backend
const BACKEND_ME_URL = `${process.env.BACKEND_URL}/api/auth/me`;

export async function GET(req: NextRequest) {
    try {
        // Forward cookies from the incoming request to the backend so it can authenticate
        const cookie = req.headers.get('cookie') || '';

        const backendRes = await fetch(BACKEND_ME_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'cookie': cookie,
            },
        });

        const data = await backendRes.json();

        return NextResponse.json(data, { status: backendRes.status });
    } catch (err) {
        console.error('Error proxying /api/auth/me:', err);
        return NextResponse.json({ message: 'Error interno' }, { status: 500 });
    }
}
