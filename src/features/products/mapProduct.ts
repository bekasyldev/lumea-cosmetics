import { imageUrl } from '../../api/products';
import type { Category, Product as ApiProduct, ProductImage, ProductVariant } from '../../api/types';
import type { Product } from '../../components/ProductCard';

// Products in this category are the storefront's "Хиты продаж".
export const HITS_CATEGORY_SLUG = 'hity-prodazh';

export interface StorefrontCategory {
    id: string;
    name: string;
    slug: string;
}

export const toStorefrontCategory = (category: Category): StorefrontCategory => ({
    id: String(category.ID),
    name: category.Name,
    slug: category.Slug,
});

// Returns null for products that can't be shown (inactive or without an active variant, so no price).
export function toStorefrontProduct(
    product: ApiProduct,
    variants: ProductVariant[],
    images: ProductImage[],
    categories: Category[],
): Product | null {
    const activeVariants = variants.filter((v) => v.IsActive);
    if (!product.IsActive || activeVariants.length === 0) return null;

    const category = categories.find((c) => c.ID === product.CategoryID);

    return {
        id: String(product.ID),
        name: product.Name,
        description: product.Description,
        createdAt: product.CreatedAt,
        // WholesalePrice (discounted price) is not used until its logic exists, so no old price/discount yet.
        price: Math.min(...activeVariants.map((v) => v.Price)),
        images: [...images].sort((a, b) => a.Position - b.Position).map(imageUrl),
        inStock: true,
        isBestSeller: category?.Slug === HITS_CATEGORY_SLUG,
        hasVariants: activeVariants.length > 1,
        variants: activeVariants.map((v) => ({ id: String(v.ID), name: v.Name, inStock: v.IsActive })),
        category: category ? { id: String(category.ID), name: category.Name } : undefined,
    };
}
