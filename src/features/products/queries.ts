import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    createProduct,
    createVariant,
    deleteImage,
    listProductImages,
    listProducts,
    listVariants,
    uploadImage,
} from '../../api/products';
import type { CreateProductRequest, CreateVariantRequest, Product, ProductVariant } from '../../api/types';

export const productKeys = {
    all: ['products'] as const,
    variants: (productId: number) => ['products', productId, 'variants'] as const,
    images: (productId: number) => ['products', productId, 'images'] as const,
};

export function useProducts() {
    return useQuery({ queryKey: productKeys.all, queryFn: listProducts });
}

export function useProductVariants(productId: number) {
    return useQuery({ queryKey: productKeys.variants(productId), queryFn: () => listVariants(productId) });
}

// The list endpoint doesn't include variants, so the products table fetches them per product.
// Returns undefined for products whose variants are still loading.
export function useVariantsByProduct(products: Product[]) {
    return useQueries({
        queries: products.map((product) => ({
            queryKey: productKeys.variants(product.ID),
            queryFn: () => listVariants(product.ID),
        })),
        combine: (results) => {
            const byProduct: Record<number, ProductVariant[] | undefined> = {};
            products.forEach((product, i) => {
                byProduct[product.ID] = results[i]?.data;
            });
            return byProduct;
        },
    });
}

export function useProductImages(productId: number) {
    return useQuery({
        queryKey: productKeys.images(productId),
        queryFn: () => listProductImages(productId),
        select: (images) => [...images].sort((a, b) => a.Position - b.Position),
    });
}

export function useCreateProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (body: CreateProductRequest) => {
            await createProduct(body);
            // The create endpoint returns no body; refetch the list to learn the new product's ID.
            const products = await queryClient.fetchQuery({ queryKey: productKeys.all, queryFn: listProducts, staleTime: 0 });
            return products.find((product) => product.Slug === body.Slug);
        },
    });
}

export function useCreateVariant(productId: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (body: Omit<CreateVariantRequest, 'ProductID'>) => createVariant({ ...body, ProductID: productId }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: productKeys.variants(productId) }),
    });
}

export function useUploadImage(productId: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ file, variantId }: { file: File; variantId: number | null }) => uploadImage(file, productId, variantId),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: productKeys.images(productId) }),
    });
}

export function useDeleteImage(productId: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteImage,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: productKeys.images(productId) }),
    });
}
