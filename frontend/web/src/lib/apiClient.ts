export type ApiResult<T = any> = {
    success: boolean;
    data?: T | null;
    errorMessage?: string;
};

const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
};

// Simple in-memory GET cache
const getCache = new Map<string, { ts: number; data: any }>();
const DEFAULT_CACHE_TTL = parseInt(process.env.NEXT_PUBLIC_API_CACHE_TTL || '') || 30_000; // 30s default, override with NEXT_PUBLIC_API_CACHE_TTL

async function request<T = any>(url: string, options: RequestInit = {}): Promise<ApiResult<T>> {
    // options supports: timeout (ms), useCache (boolean)
    const timeout = (options as any).timeout ?? 10000;
    const useCache = (options as any).useCache !== undefined ? (options as any).useCache : true;

    try {
        const headers = { ...(options.headers || {}), ...defaultHeaders } as Record<string, string>;

        const method = (options.method || 'GET').toUpperCase();

        // GET cache
        if (method === 'GET' && useCache) {
            const cached = getCache.get(url);
            if (cached && Date.now() - cached.ts < DEFAULT_CACHE_TTL) {
                return { success: true, data: cached.data };
            }
        }

        const controller = new AbortController();
        const signal = (options as any).signal || controller.signal;
        const fetchOptions: RequestInit = {
            ...options,
            headers,
            signal,
            credentials: (options as any).credentials ?? 'include', // include cookies by default
        };

        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(url, fetchOptions);
        clearTimeout(timeoutId);

        if (response.ok) {
            let parsed: any = null;
            try {
                parsed = await response.json();
            } catch (_) {
                parsed = null;
            }

            const data = parsed?.data ?? parsed;

            if (method === 'GET' && useCache) {
                getCache.set(url, { ts: Date.now(), data });
            }

            return {
                success: true,
                data,
            };
        }

        if (response.status === 401) {
            return { success: false, errorMessage: "No tienes permisos para acceder a este recurso" };
        }

        let text = "";
        try {
            text = await response.text();
        } catch (_) {
            text = "Error en la petición al servidor";
        }
        return { success: false, errorMessage: text || "Error en la petición al servidor" };
    } catch (error: any) {
        if (error?.name === 'AbortError') {
            return { success: false, errorMessage: 'La petición fue cancelada o excedió el tiempo de espera' };
        }
        console.error("API request error:", error);
        return { success: false, errorMessage: "Error en la conexión con el servidor" };
    }
}

export const api = {
    request,
    get: <T = any>(url: string) => request<T>(url, { method: "GET" }),
    post: <T = any>(url: string, body?: any) => request<T>(url, { method: "POST", body: JSON.stringify(body) }),
    patch: <T = any>(url: string, body?: any) => request<T>(url, { method: "PATCH", body: JSON.stringify(body) }),
    del: <T = any>(url: string) => request<T>(url, { method: "DELETE" }),
};

export default api;
