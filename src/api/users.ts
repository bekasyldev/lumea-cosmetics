import { apiFetch } from './client';
import type { User } from './types';

export async function listUsers() {
    // The backend encodes an empty list as null.
    return (await apiFetch<User[] | null>('/users')) ?? [];
}
