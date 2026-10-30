import { X } from 'lucide-react';
import { CATEGORIES } from '../../data/products';
import type { CatalogFilters } from '../../features/catalog/filterProducts';

interface Props {
  filters: CatalogFilters;
  onChange: (patch: Partial<CatalogFilters>) => void;
  onReset: () => void;
}

const fmt = (n: number) => n.toLocaleString('ru-RU');

export default function ActiveFilters({ filters, onChange, onReset }: Props) {
  const chips: { key: string; label: string; clear: () => void }[] = [];

  if (filters.category) {
    const c = CATEGORIES.find((c) => c.id === filters.category);
    chips.push({ key: 'cat', label: c?.name ?? filters.category, clear: () => onChange({ category: '' }) });
  }
  if (filters.q.trim()) chips.push({ key: 'q', label: `«${filters.q.trim()}»`, clear: () => onChange({ q: '' }) });
  if (filters.minPrice !== null || filters.maxPrice !== null) {
    const label =
      filters.minPrice !== null && filters.maxPrice !== null
        ? `${fmt(filters.minPrice)} – ${fmt(filters.maxPrice)} ₸`
        : filters.minPrice !== null
          ? `от ${fmt(filters.minPrice)} ₸`
          : `до ${fmt(filters.maxPrice!)} ₸`;
    chips.push({ key: 'price', label, clear: () => onChange({ minPrice: null, maxPrice: null }) });
  }
  if (filters.inStock) chips.push({ key: 'stock', label: 'В наличии', clear: () => onChange({ inStock: false }) });
  if (filters.bestseller) chips.push({ key: 'best', label: 'Хиты продаж', clear: () => onChange({ bestseller: false }) });
  if (filters.discounted) chips.push({ key: 'disc', label: 'Со скидкой', clear: () => onChange({ discounted: false }) });

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-5">
      {chips.map((c) => (
        <button
          key={c.key}
          type="button"
          onClick={c.clear}
          className="inline-flex items-center gap-1 h-8 pl-3 pr-2 rounded-full bg-[#FFE1EC] text-[#33333D] text-xs hover:bg-[#ffd0e0] transition-colors"
          aria-label={`Убрать фильтр ${c.label}`}
        >
          {c.label}
          <X size={14} />
        </button>
      ))}
      <button type="button" onClick={onReset} className="text-xs text-[#FB6F92] hover:underline ml-1">
        Сбросить всё
      </button>
    </div>
  );
}
