import { useQuery } from '@tanstack/react-query';
import { listOrders } from '../../api/orders';

export const ordersQueryKey = ['orders'] as const;

export function useOrders() {
    return useQuery({
        queryKey: ordersQueryKey,
        queryFn: listOrders,
        // New orders arrive from the storefront; keep the list fresh without manual reloads.
        refetchInterval: 30_000,
    });
}
