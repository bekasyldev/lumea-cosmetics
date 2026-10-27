import { apiFetch } from './client';
import type { CreateProductRequest, CreateVariantRequest, Product, ProductImage, ProductVariant } from './types';

// The backend encodes empty lists as null.

export async function listProducts() {
    return (await apiFetch<Product[] | null>('/products')) ?? [];
}

// Responds 201 with an empty body — the new product's ID is not returned.
export function createProduct(body: CreateProductRequest) {
    return apiFetch<void>('/products', { method: 'POST', body });
}

export async function listVariants(productId: number) {
    return (await apiFetch<ProductVariant[] | null>(`/products/${productId}/variants`)) ?? [];
}

// The backend reads ProductID from the body, not the URL, so both must be set.
export function createVariant(body: CreateVariantRequest) {
    return apiFetch<void>(`/products/${body.ProductID}/variants`, { method: 'POST', body });
}

export async function listProductImages(productId: number) {
    return (await apiFetch<ProductImage[] | null>(`/products/${productId}/images`)) ?? [];
}

export function uploadImage(file: File, productId: number, variantId: number | null) {
    const body = new FormData();
    body.append('file', file);
    body.append('product_id', String(productId));
    if (variantId !== null) body.append('variant_id', String(variantId));
    return apiFetch<ProductImage>('/images', { method: 'POST', body });
}

export function deleteImage(id: number) {
    return apiFetch<void>(`/images/${id}`, { method: 'DELETE' });
}

const MEDIA_URL = import.meta.env.VITE_MEDIA_URL ?? 'http://localhost:9000/lumea-media';

// Images live in S3 at {S3_ENDPOINT}/{S3_BUCKET}/{S3Key}; the API only returns the key.
export function imageUrl(image: ProductImage) {
    return `${MEDIA_URL}/${image.S3Key}`;
}
