import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, ImageIcon, Loader2, Package, Plus, Search } from 'lucide-react';
import type { ProductVariant } from '../../api/types';
import Chip from '../../components/admin/Chip';
import EmptyState from '../../components/admin/EmptyState';
import { useToast } from '../../components/admin/toast/useToast';
import { btn, card, iconBtn, input, pageTitle, tableHead } from '../../components/admin/ui';
import { useCategories } from '../../features/categories/useCategories';
import ActiveBadge from '../../features/products/ActiveBadge';
import NewProductModal from '../../features/products/NewProductModal';
import { useProducts, useVariantsByProduct } from '../../features/products/queries';
import { formatMoney } from '../../lib/format';

// 'all', 'none' (no category) or a category ID.
type CategoryFilter = 'all' | 'none' | number;

const columns = 'grid grid-cols-[minmax(240px,2fr)_170px_190px_110px_44px] items-center gap-x-4 px-7';

function VariantsSummary({ variants }: { variants: ProductVariant[] | undefined }) {
    if (!variants) return <span className="text-muted">…</span>;
    if (variants.length === 0) {
        return (
            <span className="inline-flex items-center gap-2 font-medium text-ink">
                <span className="size-2 rounded-full bg-brand-pink" />
                Нет вариантов
            </span>
        );
    }
    // "From" price counts only orderable variants, unless all are hidden.
    const active = variants.filter((variant) => variant.IsActive);
    const base = active.length ? active : variants;
    const minPrice = Math.min(...base.map((variant) => variant.Price));
    return <span className="tabular-nums">{`${variants.length} · от ${formatMoney(minPrice)}`}</span>;
}

export default function ProductsPage() {
    const navigate = useNavigate();
    const showToast = useToast();
    const { data: products = [], isPending, isError, refetch } = useProducts();
    const { data: categories = [] } = useCategories();
    const variantsByProduct = useVariantsByProduct(products);

    const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
    const [search, setSearch] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    const categoryName = (id: number | null) => categories.find((category) => category.ID === id)?.Name ?? 'Без категории';
    const hasUncategorized = products.some((product) => product.CategoryID === null);
    const hiddenCount = products.filter((product) => !product.IsActive).length;

    const visibleProducts = useMemo(() => {
        const query = search.trim().toLowerCase();
        return products.filter((product) => {
            const categoryMatches =
                categoryFilter === 'all' ||
                (categoryFilter === 'none' ? product.CategoryID === null : product.CategoryID === categoryFilter);
            const searchMatches = !query || `${product.Name} ${product.Slug}`.toLowerCase().includes(query);
            return categoryMatches && searchMatches;
        });
    }, [products, categoryFilter, search]);

    const filterActive = categoryFilter !== 'all' || search.trim() !== '';
    const resetFilters = () => {
        setCategoryFilter('all');
        setSearch('');
    };

    return (
        <main className="flex flex-col gap-6 px-4 py-8 sm:px-10 lg:py-10">
            <header className="flex flex-wrap items-end justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className={pageTitle}>Товары</h1>
                    <p className="text-sm text-muted">
                        Всего: {products.length}
                        {hiddenCount > 0 && ` · скрыто: ${hiddenCount}`}
                    </p>
                </div>
                <button type="button" className={btn.primary} onClick={() => setIsCreating(true)}>
                    <Plus size={20} />
                    Новый товар
                </button>
            </header>

            <div className="flex flex-wrap items-center justify-between gap-4">
                <div role="group" aria-label="Фильтр по категории" className="flex flex-wrap gap-2">
                    <Chip active={categoryFilter === 'all'} onClick={() => setCategoryFilter('all')}>
                        Все
                    </Chip>
                    {categories.map((category) => (
                        <Chip
                            key={category.ID}
                            active={categoryFilter === category.ID}
                            onClick={() => setCategoryFilter(category.ID)}
                        >
                            {category.Name}
                        </Chip>
                    ))}
                    {hasUncategorized && (
                        <Chip active={categoryFilter === 'none'} onClick={() => setCategoryFilter('none')}>
                            Без категории
                        </Chip>
                    )}
                </div>

                <label className="relative max-w-[380px] flex-[1_1_280px]">
                    <span className="sr-only">Поиск по товарам</span>
                    <Search size={20} className="pointer-events-none absolute top-3 left-4 text-ink" />
                    <input
                        type="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Название или slug"
                        className={`${input} rounded-full pl-[46px]`}
                    />
                </label>
            </div>

            <section className={`${card} overflow-hidden`}>
                {isPending ? (
                    <div className="flex justify-center py-16 text-ink">
                        <Loader2 className="animate-spin" />
                    </div>
                ) : isError ? (
                    <div className="py-16 text-center text-sm text-muted">
                        Не удалось загрузить товары.{' '}
                        <button type="button" onClick={() => refetch()} className="font-medium text-ink underline">
                            Повторить
                        </button>
                    </div>
                ) : visibleProducts.length === 0 ? (
                    <EmptyState
                        icon={<Package size={28} />}
                        title={products.length ? 'Ничего не найдено' : 'Каталог пуст'}
                        hint={
                            products.length
                                ? 'Измените категорию или поисковый запрос.'
                                : 'Добавьте первый товар, затем — варианты с ценами.'
                        }
                        action={
                            products.length > 0 &&
                            filterActive && (
                                <button type="button" className={btn.secondary} onClick={resetFilters}>
                                    Сбросить фильтры
                                </button>
                            )
                        }
                    />
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <div role="table" aria-label="Товары" className="min-w-[900px] text-sm">
                                <div role="row" className={`${columns} ${tableHead} min-h-11`}>
                                    <div role="columnheader">Товар</div>
                                    <div role="columnheader">Категория</div>
                                    <div role="columnheader">Варианты</div>
                                    <div role="columnheader">Статус</div>
                                    <div role="columnheader" />
                                </div>
                                {visibleProducts.map((product) => (
                                    <div
                                        key={product.ID}
                                        role="row"
                                        className={`${columns} min-h-16 border-b border-line py-2 last:border-b-0 hover:bg-wash`}
                                    >
                                        <div role="cell" className="flex min-w-0 items-center gap-3">
                                            <span
                                                aria-hidden="true"
                                                className="flex size-11 shrink-0 items-center justify-center rounded-[10px] bg-mint text-[#9a5a78]"
                                            >
                                                <ImageIcon size={20} />
                                            </span>
                                            <div className="flex min-w-0 flex-col">
                                                <Link
                                                    to={`/admin/products/${product.ID}`}
                                                    className="truncate font-medium text-ink underline decoration-transparent decoration-[1.5px] underline-offset-4 hover:decoration-brand-pink"
                                                >
                                                    {product.Name}
                                                </Link>
                                                <span className="truncate text-xs text-muted tabular-nums">{product.Slug}</span>
                                            </div>
                                        </div>
                                        <div role="cell" className="text-muted">
                                            {categoryName(product.CategoryID)}
                                        </div>
                                        <div role="cell">
                                            <VariantsSummary variants={variantsByProduct[product.ID]} />
                                        </div>
                                        <div role="cell">
                                            <ActiveBadge active={product.IsActive} />
                                        </div>
                                        <div role="cell">
                                            <Link
                                                to={`/admin/products/${product.ID}`}
                                                aria-label={`Открыть товар ${product.Name}`}
                                                className={iconBtn}
                                            >
                                                <ChevronRight size={20} />
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <p className="border-t border-line px-7 py-4 text-xs text-muted">
                            Показано {visibleProducts.length} из {products.length}
                        </p>
                    </>
                )}
            </section>

            {isCreating && (
                <NewProductModal
                    categories={categories}
                    products={products}
                    onClose={() => setIsCreating(false)}
                    onCreated={(product) => {
                        setIsCreating(false);
                        if (product) {
                            showToast('Товар создан. Добавьте первый вариант');
                            navigate(`/admin/products/${product.ID}`);
                        } else {
                            showToast('Товар создан');
                        }
                    }}
                />
            )}
        </main>
    );
}
