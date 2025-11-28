export type ApiResult<T = any> = {
    success: boolean;
    data?: T | null;
    errorMessage?: string;
};

const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
};

async function request<T = any>(url: string, options: RequestInit = {}): Promise<ApiResult<T>> {
    try {
        const headers = { ...(options.headers || {}), ...defaultHeaders } as Record<string, string>;
        const response = await fetch(url, { ...options, headers });

        if (response.ok) {
            let parsed: any = null;
            try {
                parsed = await response.json();
            } catch (_) {
                parsed = null;
            }
            return {
                success: true,
                data: parsed?.data ?? parsed,
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
    } catch (error) {
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
