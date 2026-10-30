import type { Product } from '../../components/ProductCard';

export type SortKey = 'default' | 'price-asc' | 'price-desc' | 'discount' | 'newest';

export interface CatalogFilters {
  q: string;
  category: string;
  sort: SortKey;
  minPrice: number | null;
  maxPrice: number | null;
  inStock: boolean;
  bestseller: boolean;
  discounted: boolean;
}

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'default', label: 'По умолчанию' },
  { value: 'price-asc', label: 'Сначала дешевле' },
  { value: 'price-desc', label: 'Сначала дороже' },
  { value: 'discount', label: 'По размеру скидки' },
  { value: 'newest', label: 'Новинки' },
];

export const discountOf = (p: Product) =>
  p.retailPrice ? Math.round((1 - p.price / p.retailPrice) * 100) : p.discount || 0;

export function parseFilters(params: URLSearchParams): CatalogFilters {
  const num = (key: string) => {
    const v = params.get(key);
    if (v === null || v === '') return null;
    const n = Number(v);
    return Number.isFinite(n) && n >= 0 ? n : null;
  };
  const sort = params.get('sort') as SortKey | null;
  return {
    q: params.get('q') ?? '',
    category: params.get('cat') ?? '',
    sort: SORT_OPTIONS.some((o) => o.value === sort) ? (sort as SortKey) : 'default',
    minPrice: num('min'),
    maxPrice: num('max'),
    inStock: params.get('instock') === '1',
    bestseller: params.get('bestseller') === '1',
    discounted: params.get('discount') === '1',
  };
}

export function serializeFilters(f: CatalogFilters): URLSearchParams {
  const p = new URLSearchParams();
  if (f.q.trim()) p.set('q', f.q.trim());
  if (f.category) p.set('cat', f.category);
  if (f.sort !== 'default') p.set('sort', f.sort);
  if (f.minPrice !== null) p.set('min', String(f.minPrice));
  if (f.maxPrice !== null) p.set('max', String(f.maxPrice));
  if (f.inStock) p.set('instock', '1');
  if (f.bestseller) p.set('bestseller', '1');
  if (f.discounted) p.set('discount', '1');
  return p;
}

export function filterProducts(products: Product[], f: CatalogFilters): Product[] {
  const q = f.q.trim().toLowerCase();
  const result = products.filter((p) => {
    if (f.category && p.category?.id !== f.category) return false;
    if (q && !p.name.toLowerCase().includes(q)) return false;
    if (f.minPrice !== null && p.price < f.minPrice) return false;
    if (f.maxPrice !== null && p.price > f.maxPrice) return false;
    if (f.inStock && !p.inStock) return false;
    if (f.bestseller && !p.isBestSeller) return false;
    if (f.discounted && discountOf(p) <= 0) return false;
    return true;
  });

  switch (f.sort) {
    case 'price-asc':
      return result.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return result.sort((a, b) => b.price - a.price);
    case 'discount':
      return result.sort((a, b) => discountOf(b) - discountOf(a));
    case 'newest':
      return result.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    default:
      return result;
  }
}

export const hasActiveFilters = (f: CatalogFilters) =>
  f.q.trim() !== '' || f.category !== '' || f.minPrice !== null || f.maxPrice !== null || f.inStock || f.bestseller || f.discounted;
