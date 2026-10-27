import { apiFetch } from './client';
import type { Category } from './types';

export async function listCategories() {
    return (await apiFetch<Category[] | null>('/categories')) ?? [];
}
