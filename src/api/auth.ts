import { apiFetch } from './client';
import type { LoginRequest, TokenPair } from './types';

export function login(username: string, password: string) {
    const body: LoginRequest = { Username: username, HashedPassword: password };
    return apiFetch<TokenPair>('/login', { method: 'POST', body, auth: false });
}

// The refresh token travels in an HttpOnly cookie (sent via `credentials: 'include'`);
// the response carries only a new access token.
export function refreshToken() {
    return apiFetch<Pick<TokenPair, 'access_token'>>('/refresh', { method: 'POST', auth: false });
}
