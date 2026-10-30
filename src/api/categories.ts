import { apiFetch } from './client';
import type { Category, CategoryRequest } from './types';

export async function listCategories() {
    return (await apiFetch<Category[] | null>('/categories')) ?? [];
}

export function createCategory(body: CategoryRequest) {
    return apiFetch<Category>('/categories', { method: 'POST', body });
}

export function updateCategory(id: number, body: CategoryRequest) {
    return apiFetch<void>(`/categories/${id}`, { method: 'PUT', body });
}

// Products in the category are kept; the database sets their category to null.
export function deleteCategory(id: number) {
    return apiFetch<void>(`/categories/${id}`, { method: 'DELETE' });
}
