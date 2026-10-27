import { useQuery } from '@tanstack/react-query';
import { listCategories } from '../../api/categories';

export const categoriesQueryKey = ['categories'] as const;

export function useCategories() {
    return useQuery({ queryKey: categoriesQueryKey, queryFn: listCategories });
}
