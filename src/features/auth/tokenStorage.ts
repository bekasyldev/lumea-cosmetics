const STORAGE_KEY = 'lumea.accessToken';

export interface TokenPayload {
    exp?: number;
    role?: string;
    [claim: string]: unknown;
}

type Listener = (token: string | null) => void;
const listeners = new Set<Listener>();

export function decodeToken(token: string): TokenPayload | null {
    try {
        const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
        const json = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
                .join(''),
        );
        return JSON.parse(json);
    } catch {
        return null;
    }
}

// Milliseconds until the token expires; Infinity when it has no exp claim.
export function msUntilExpiry(token: string): number {
    const exp = decodeToken(token)?.exp;
    return exp ? exp * 1000 - Date.now() : Infinity;
}

function read(): string | null {
    try {
        return sessionStorage.getItem(STORAGE_KEY);
    } catch {
        return null;
    }
}

function write(token: string | null) {
    try {
        if (token) sessionStorage.setItem(STORAGE_KEY, token);
        else sessionStorage.removeItem(STORAGE_KEY);
    } catch {
        // Storage unavailable (private mode etc.) — session lasts until reload.
    }
    listeners.forEach((listener) => listener(token));
}

export const tokenStorage = {
    // Returns the stored token, or null if missing or already expired.
    get(): string | null {
        const token = read();
        if (token && msUntilExpiry(token) <= 0) {
            write(null);
            return null;
        }
        return token;
    },
    set(token: string) {
        write(token);
    },
    clear() {
        write(null);
    },
    subscribe(listener: Listener) {
        listeners.add(listener);
        return () => {
            listeners.delete(listener);
        };
    },
};
