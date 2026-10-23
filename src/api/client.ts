import { tokenStorage } from '../features/auth/tokenStorage';

const BASE_URL = import.meta.env.VITE_API_URL ?? '/api';

export class ApiError extends Error {
    status: number;

    constructor(status: number, message: string) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
    }
}

interface RequestOptions {
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    body?: unknown;
    // Send the Bearer token. Defaults to true; public endpoints (login) pass false.
    auth?: boolean;
}

export async function apiFetch<T>(path: string, { method = 'GET', body, auth = true }: RequestOptions = {}): Promise<T> {
    const headers: Record<string, string> = { Accept: 'application/json' };
    const isFormData = body instanceof FormData;

    if (body !== undefined && !isFormData) headers['Content-Type'] = 'application/json';

    if (auth) {
        const token = tokenStorage.get();
        if (token) headers.Authorization = `Bearer ${token}`;
    }

    let response: Response;
    try {
        response = await fetch(`${BASE_URL}${path}`, {
            method,
            headers,
            credentials: 'include',
            body: body === undefined ? undefined : isFormData ? body : JSON.stringify(body),
        });
    } catch {
        throw new ApiError(0, 'Network error');
    }

    if (!response.ok) {
        // Expired or revoked session — drop the token so route guards send the user to login.
        if (response.status === 401 && auth) tokenStorage.clear();
        const message = (await response.text()).trim() || response.statusText;
        throw new ApiError(response.status, message);
    }

    if (response.status === 204) return undefined as T;

    const text = await response.text();
    return (text ? JSON.parse(text) : undefined) as T;
}
