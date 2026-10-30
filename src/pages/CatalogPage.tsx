import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Search, SlidersHorizontal, X } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import CatalogFilters from '../components/catalog/CatalogFilters';
import ActiveFilters from '../components/catalog/ActiveFilters';
import { useStorefrontProducts } from '../features/products/useStorefrontProducts';
import {
  SORT_OPTIONS,
  filterProducts,
  hasActiveFilters,
  parseFilters,
  serializeFilters,
  type CatalogFilters as Filters,
  type SortKey,
} from '../features/catalog/filterProducts';

const PAGE_SIZE = 12;

const plural = (n: number) => {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return 'товар';
  if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return 'товара';
  return 'товаров';
};

export default function CatalogPage() {
  const { products, categories, isLoading, isError, refetch } = useStorefrontProducts();
  const [params, setParams] = useSearchParams();
  const filters = useMemo(() => parseFilters(params), [params]);
  const paramsKey = params.toString();

  const [search, setSearch] = useState(filters.q);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [page, setPage] = useState(1);

  const update = useCallback(
    (patch: Partial<Filters>) => {
      setParams((prev) => serializeFilters({ ...parseFilters(prev), ...patch }), { replace: true });
    },
    [setParams],
  );

  const reset = () => {
    setSearch('');
    setParams({}, { replace: true });
  };

  // debounce the search box into the URL
  useEffect(() => {
    if (search === filters.q) return;
    const t = setTimeout(() => update({ q: search }), 300);
    return () => clearTimeout(t);
  }, [search, filters.q, update]);

  // keep the box in sync when the query is cleared elsewhere (chips, reset, back button)
  useEffect(() => {
    setSearch(filters.q);
  }, [filters.q]);

  // restart pagination when the filters change
  useEffect(() => {
    setPage(1);
  }, [paramsKey]);

  const goToPage = (n: number) => {
    setPage(n);
    document.getElementById('catalog-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const results = useMemo(() => filterProducts(products, filters), [products, filters]);
  const pageCount = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const from = (current - 1) * PAGE_SIZE;
  const shown = results.slice(from, from + PAGE_SIZE);
  const active = hasActiveFilters(filters);

  return (
    <>
      <Header />
      <section className="bg-gradient-to-br from-[#FFE1EC] via-[#FFF0F5] to-white">
        <div className="container mx-auto px-4 py-12 sm:py-16 text-center">
          <h1 className="text-3xl sm:text-4xl font-medium text-[#33333D]">Каталог</h1>
          <nav aria-label="Хлебные крошки" className="mt-3 text-sm text-gray-500">
            <a href="/" className="hover:text-[#FB6F92]">Главная</a>
            <span className="mx-2">/</span>
            <span className="text-[#33333D]">Каталог</span>
          </nav>
        </div>
      </section>

      <main className="container mx-auto my-8 px-4 min-h-[60vh]">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск по каталогу"
              aria-label="Поиск по каталогу"
              className="w-full h-11 rounded-full border border-gray-200 pl-10 pr-10 text-sm focus:outline-none focus:border-[#FB6F92] focus:ring-1 focus:ring-[#FB6F92] [&::-webkit-search-cancel-button]:hidden"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                aria-label="Очистить поиск"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="lg:hidden flex-1 sm:flex-none h-11 px-5 rounded-full border border-gray-200 text-sm text-[#33333D] inline-flex items-center justify-center gap-2"
            >
              <SlidersHorizontal size={16} />
              Фильтры
            </button>
            <select
              value={filters.sort}
              onChange={(e) => update({ sort: e.target.value as SortKey })}
              aria-label="Сортировка"
              className="flex-1 sm:flex-none h-11 rounded-full border border-gray-200 bg-white px-4 text-sm text-[#33333D] focus:outline-none focus:border-[#FB6F92]"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <ActiveFilters filters={filters} onChange={update} onReset={reset} categories={categories} />

        <div id="catalog-results" className="flex gap-8 items-start scroll-mt-4">
          <CatalogFilters
            filters={filters}
            onChange={update}
            onReset={reset}
            resetDisabled={!active}
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            resultCount={results.length}
            products={products}
            categories={categories}
          />

          <section className="flex-1 min-w-0">
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-3 gap-y-5">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-gray-100 rounded-lg aspect-[3/4] animate-pulse" />
                ))}
              </div>
            ) : isError ? (
              <div className="flex flex-col items-center text-center py-20">
                <h2 className="text-xl font-medium text-[#33333D] mb-1">Не удалось загрузить товары</h2>
                <p className="text-sm text-gray-500 mb-5">Проверьте соединение и попробуйте ещё раз</p>
                <button
                  type="button"
                  onClick={refetch}
                  className="h-11 px-6 rounded-full bg-[#FB6F92] text-white text-sm font-semibold hover:bg-[#f95a82] transition-colors"
                >
                  Повторить
                </button>
              </div>
            ) : results.length === 0 ? (
              <div className="flex flex-col items-center text-center py-20">
                <div className="w-16 h-16 rounded-full bg-[#FFE1EC] flex items-center justify-center mb-4">
                  <Search size={28} className="text-[#FB6F92]" />
                </div>
                <h2 className="text-xl font-medium text-[#33333D] mb-1">Ничего не найдено</h2>
                <p className="text-sm text-gray-500 mb-5">Попробуйте изменить запрос или сбросить фильтры</p>
                <button
                  type="button"
                  onClick={reset}
                  className="h-11 px-6 rounded-full bg-[#FB6F92] text-white text-sm font-semibold hover:bg-[#f95a82] transition-colors"
                >
                  Сбросить фильтры
                </button>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-500 mb-4" aria-live="polite">
                  Показано {from + 1}–{from + shown.length} из {results.length} {plural(results.length)}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-3 gap-y-5">
                  {shown.map((product) => (
                    <ProductCard key={product.id} product={product} showAddToCart />
                  ))}
                </div>

                {pageCount > 1 && (
                  <nav aria-label="Страницы" className="mt-10 pt-6 border-t border-gray-100 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => goToPage(current - 1)}
                        disabled={current === 1}
                        aria-label="Предыдущая страница"
                        className="w-9 h-9 rounded border border-gray-200 inline-flex items-center justify-center text-gray-600 hover:border-[#FB6F92] disabled:opacity-40 disabled:pointer-events-none"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => goToPage(n)}
                          aria-current={n === current ? 'page' : undefined}
                          className={`w-9 h-9 rounded border text-sm transition-colors ${
                            n === current
                              ? 'border-[#FB6F92] bg-[#FB6F92] text-white'
                              : 'border-gray-200 text-gray-600 hover:border-[#FB6F92]'
                          }`}
                        >
                          {n}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => goToPage(current + 1)}
                        disabled={current === pageCount}
                        aria-label="Следующая страница"
                        className="w-9 h-9 rounded border border-gray-200 inline-flex items-center justify-center text-gray-600 hover:border-[#FB6F92] disabled:opacity-40 disabled:pointer-events-none"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                    <p className="hidden sm:block text-xs text-gray-500">
                      Показано {from + 1}–{from + shown.length} из {results.length}
                    </p>
                  </nav>
                )}
              </>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
