import { NextRequest } from "next/server";

export async function getAuthHeaders(req: NextRequest) {
    const token = req.cookies.get('access_token')?.value;
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    }
}