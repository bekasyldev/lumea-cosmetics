import { apiFetch } from './client';
import type { Order } from './types';

export async function listOrders() {
    // The backend encodes an empty list as null.
    return (await apiFetch<Order[] | null>('/orders')) ?? [];
}
