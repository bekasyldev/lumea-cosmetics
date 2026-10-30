import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import type { CatalogFilters as Filters } from '../../features/catalog/filterProducts';
import { CATEGORIES, sampleProducts } from '../../data/products';

interface Props {
  filters: Filters;
  onChange: (patch: Partial<Filters>) => void;
  onReset: () => void;
  resetDisabled: boolean;
  /** Mobile drawer mode */
  open?: boolean;
  onClose?: () => void;
  resultCount: number;
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center justify-between gap-3 py-2 cursor-pointer select-none">
      <span className="text-sm text-[#33333D]">{label}</span>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only peer" />
      <span className="relative w-10 h-6 rounded-full bg-gray-200 transition-colors peer-checked:bg-[#FB6F92] peer-focus-visible:ring-2 peer-focus-visible:ring-[#FB6F92]/50 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-5 after:h-5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:after:translate-x-4" />
    </label>
  );
}

function PriceInputs({ filters, onChange }: Pick<Props, 'filters' | 'onChange'>) {
  const [min, setMin] = useState(filters.minPrice?.toString() ?? '');
  const [max, setMax] = useState(filters.maxPrice?.toString() ?? '');

  // keep inputs in sync when filters are reset/removed externally
  useEffect(() => setMin(filters.minPrice?.toString() ?? ''), [filters.minPrice]);
  useEffect(() => setMax(filters.maxPrice?.toString() ?? ''), [filters.maxPrice]);

  const commit = () => {
    const toNum = (v: string) => (v.trim() === '' || Number(v) < 0 || Number.isNaN(Number(v)) ? null : Number(v));
    onChange({ minPrice: toNum(min), maxPrice: toNum(max) });
  };

  const inputCls =
    'w-full h-10 rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:border-[#FB6F92] focus:ring-1 focus:ring-[#FB6F92]';

  return (
    <div className="flex items-center gap-2">
      <input
        inputMode="numeric"
        placeholder="От"
        value={min}
        onChange={(e) => setMin(e.target.value.replace(/\D/g, ''))}
        onBlur={commit}
        onKeyDown={(e) => e.key === 'Enter' && commit()}
        className={inputCls}
        aria-label="Цена от"
      />
      <span className="text-gray-400">—</span>
      <input
        inputMode="numeric"
        placeholder="До"
        value={max}
        onChange={(e) => setMax(e.target.value.replace(/\D/g, ''))}
        onBlur={commit}
        onKeyDown={(e) => e.key === 'Enter' && commit()}
        className={inputCls}
        aria-label="Цена до"
      />
    </div>
  );
}

function Categories({ filters, onChange }: Pick<Props, 'filters' | 'onChange'>) {
  const items = [{ id: '', name: 'Все товары' }, ...CATEGORIES];
  return (
    <div>
      <h3 className="text-sm font-semibold text-[#33333D] mb-2">Категории</h3>
      <ul>
        {items.map((c) => {
          const count = c.id ? sampleProducts.filter((p) => p.category?.id === c.id).length : sampleProducts.length;
          const active = filters.category === c.id;
          return (
            <li key={c.id || 'all'}>
              <button
                type="button"
                onClick={() => onChange({ category: c.id })}
                aria-pressed={active}
                className={`w-full flex items-center justify-between py-2 text-sm transition-colors ${
                  active ? 'text-[#FB6F92] font-semibold' : 'text-gray-600 hover:text-[#FB6F92]'
                }`}
              >
                <span>{c.name}</span>
                <span className="text-xs text-gray-400">{count}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Featured() {
  const items = sampleProducts.filter((p) => p.isBestSeller).slice(0, 4);
  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium text-[#33333D] mb-4">Хиты продаж</h3>
      <ul className="space-y-4">
        {items.map((p) => (
          <li key={p.id}>
            <a
              href={`https://wa.me/7053371911?text=${encodeURIComponent(`Здравствуйте! Хочу узнать цену на товар: ${p.name}`)}`}
              target="_blank"
              rel="noreferrer"
              className="flex gap-3 group"
            >
              <img src={p.images[0]} alt="" className="w-16 h-16 rounded-lg object-cover bg-gray-100 shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-gray-700 line-clamp-2 group-hover:text-[#FB6F92]">{p.name}</p>
                <p className="mt-1 text-sm font-semibold text-[#33333D]">{p.price.toLocaleString('ru-RU')} ₸</p>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Body({ filters, onChange, onReset, resetDisabled }: Props) {
  return (
    <div className="space-y-5">
      <Categories filters={filters} onChange={onChange} />
      <div className="border-t border-gray-100 pt-5">
      <div>
        <h3 className="text-sm font-semibold text-[#33333D] mb-2">Цена, ₸</h3>
        <PriceInputs filters={filters} onChange={onChange} />
        <div className="flex flex-wrap gap-2 mt-3">
          {[
            ['До 1 000', null, 1000],
            ['1 000–2 000', 1000, 2000],
            ['От 2 000', 2000, null],
          ].map(([label, lo, hi]) => {
            const active = filters.minPrice === lo && filters.maxPrice === hi;
            return (
              <button
                key={label as string}
                type="button"
                onClick={() => onChange({ minPrice: active ? null : (lo as number | null), maxPrice: active ? null : (hi as number | null) })}
                className={`px-3 h-8 rounded-full text-xs border transition-colors ${
                  active ? 'bg-[#FB6F92] border-[#FB6F92] text-white' : 'border-gray-200 text-gray-600 hover:border-[#FB6F92]'
                }`}
              >
                {label as string}
              </button>
            );
          })}
        </div>
      </div>
      </div>

      <div className="border-t border-gray-100 pt-3">
        <Toggle label="В наличии" checked={filters.inStock} onChange={(v) => onChange({ inStock: v })} />
        <Toggle label="Хиты продаж" checked={filters.bestseller} onChange={(v) => onChange({ bestseller: v })} />
        <Toggle label="Со скидкой" checked={filters.discounted} onChange={(v) => onChange({ discounted: v })} />
      </div>

      <button
        type="button"
        onClick={onReset}
        disabled={resetDisabled}
        className="w-full h-10 rounded-full border border-gray-200 text-sm text-gray-600 hover:border-[#FB6F92] hover:text-[#FB6F92] transition-colors disabled:opacity-40 disabled:pointer-events-none"
      >
        Сбросить фильтры
      </button>
    </div>
  );
}

export default function CatalogFilters(props: Props) {
  const { open = false, onClose, resultCount } = props;

  // lock body scroll + close on Escape while the mobile drawer is open
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose?.();
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="rounded-2xl border border-gray-100 p-5">
          <h2 className="text-lg font-medium text-[#33333D] mb-4">Фильтры</h2>
          <Body {...props} />
        </div>
        <Featured />
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Фильтры">
          <div className="absolute inset-0 bg-black/40" onClick={onClose} />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] flex flex-col rounded-t-2xl bg-white">
            <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-gray-100">
              <h2 className="text-lg font-medium text-[#33333D]">Фильтры</h2>
              <button type="button" onClick={onClose} aria-label="Закрыть" className="p-1 text-gray-500">
                <X size={22} />
              </button>
            </div>
            <div className="overflow-y-auto px-5 py-4">
              <Body {...props} />
            </div>
            <div className="px-5 py-3 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="w-full h-11 rounded-full bg-[#FB6F92] text-white text-sm font-semibold"
              >
                Показать {resultCount} {resultCount === 1 ? 'товар' : 'товаров'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
