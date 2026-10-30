import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createCategory, deleteCategory, listCategories, updateCategory } from '../../api/categories';
import type { CategoryRequest } from '../../api/types';
import { productKeys } from '../products/queries';

export const categoriesQueryKey = ['categories'] as const;

export function useCategories() {
    return useQuery({ queryKey: categoriesQueryKey, queryFn: listCategories });
}

// Creates when id is null, otherwise updates.
export function useSaveCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, body }: { id: number | null; body: CategoryRequest }) => {
            if (id === null) await createCategory(body);
            else await updateCategory(id, body);
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: categoriesQueryKey }),
    });
}

export function useDeleteCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: categoriesQueryKey });
            // Its products are now uncategorized.
            queryClient.invalidateQueries({ queryKey: productKeys.all, exact: true });
        },
    });
}
