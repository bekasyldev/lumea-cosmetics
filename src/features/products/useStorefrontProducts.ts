import { useMemo } from 'react';
import { useQueries } from '@tanstack/react-query';
import { listProductImages, listVariants } from '../../api/products';
import { useCategories } from '../categories/useCategories';
import { productKeys, useProducts } from './queries';
import { toStorefrontCategory, toStorefrontProduct } from './mapProduct';

// The API has no aggregate endpoint: products, then variants and images per product (shared cache with the admin).
export function useStorefrontProducts() {
    const productsQuery = useProducts();
    const categoriesQuery = useCategories();
    const apiProducts = useMemo(() => productsQuery.data ?? [], [productsQuery.data]);

    const variantQueries = useQueries({
        queries: apiProducts.map((p) => ({ queryKey: productKeys.variants(p.ID), queryFn: () => listVariants(p.ID) })),
    });
    const imageQueries = useQueries({
        queries: apiProducts.map((p) => ({ queryKey: productKeys.images(p.ID), queryFn: () => listProductImages(p.ID) })),
    });

    const isLoading =
        productsQuery.isPending ||
        categoriesQuery.isPending ||
        variantQueries.some((q) => q.isPending) ||
        imageQueries.some((q) => q.isPending);
    const isError =
        productsQuery.isError || categoriesQuery.isError || variantQueries.some((q) => q.isError) || imageQueries.some((q) => q.isError);

    const products = useMemo(() => {
        if (isLoading || isError) return [];
        const categories = categoriesQuery.data ?? [];
        return apiProducts
            .map((p, i) => toStorefrontProduct(p, variantQueries[i].data ?? [], imageQueries[i].data ?? [], categories))
            .filter((p) => p !== null);
    }, [isLoading, isError, apiProducts, categoriesQuery.data, variantQueries, imageQueries]);

    const categories = useMemo(() => (categoriesQuery.data ?? []).map(toStorefrontCategory), [categoriesQuery.data]);

    const refetch = () => {
        productsQuery.refetch();
        categoriesQuery.refetch();
        variantQueries.forEach((q) => q.refetch());
        imageQueries.forEach((q) => q.refetch());
    };

    return { products, categories, isLoading, isError, refetch };
}
