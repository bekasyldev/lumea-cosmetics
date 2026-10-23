import { apiFetch } from './client';
import type { LoginRequest, TokenPair } from './types';

export function login(username: string, password: string) {
    const body: LoginRequest = { Username: username, HashedPassword: password };
    return apiFetch<TokenPair>('/login', { method: 'POST', body, auth: false });
}
