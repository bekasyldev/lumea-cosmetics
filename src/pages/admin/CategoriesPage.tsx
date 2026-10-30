import { useState } from 'react';
import { Loader2, Pencil, Plus, Tag, Trash2 } from 'lucide-react';
import type { Category } from '../../api/types';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import EmptyState from '../../components/admin/EmptyState';
import { useToast } from '../../components/admin/toast/useToast';
import { btn, card, iconBtn, iconBtnDanger, pageTitle, tableHead } from '../../components/admin/ui';
import CategoryModal from '../../features/categories/CategoryModal';
import { useCategories, useDeleteCategory } from '../../features/categories/useCategories';
import { useProducts } from '../../features/products/queries';
import { formatDateTime } from '../../lib/format';

const columns =
    'grid grid-cols-[minmax(180px,1.5fr)_minmax(160px,1.2fr)_100px_150px_96px] items-center gap-x-4 px-7';

// null = closed, 'new' = creating, Category = editing.
type Editing = Category | 'new' | null;

export default function CategoriesPage() {
    const showToast = useToast();
    const { data: categories = [], isPending, isError, refetch } = useCategories();
    const { data: products = [] } = useProducts();
    const deleteCategory = useDeleteCategory();

    const [editing, setEditing] = useState<Editing>(null);
    const [toDelete, setToDelete] = useState<Category | null>(null);

    const productCount = (id: number) => products.filter((product) => product.CategoryID === id).length;

    const openNew = () => setEditing('new');

    const confirmDelete = () => {
        if (!toDelete) return;
        deleteCategory.mutate(toDelete.ID, {
            onSuccess: () => {
                setToDelete(null);
                showToast('Категория удалена');
            },
        });
    };

    const deleteCount = toDelete ? productCount(toDelete.ID) : 0;

    return (
        <main className="flex flex-col gap-6 px-4 py-8 sm:px-10 lg:py-10">
            <header className="flex flex-wrap items-end justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className={pageTitle}>Категории</h1>
                    <p className="text-sm text-muted">Всего: {categories.length}</p>
                </div>
                <button type="button" className={btn.primary} onClick={openNew}>
                    <Plus size={20} />
                    Новая категория
                </button>
            </header>

            <section className={`${card} overflow-hidden`}>
                {isPending ? (
                    <div className="flex justify-center py-16 text-ink">
                        <Loader2 className="animate-spin" />
                    </div>
                ) : isError ? (
                    <div className="py-16 text-center text-sm text-muted">
                        Не удалось загрузить категории.{' '}
                        <button type="button" onClick={() => refetch()} className="font-medium text-ink underline">
                            Повторить
                        </button>
                    </div>
                ) : categories.length === 0 ? (
                    <EmptyState
                        icon={<Tag size={28} />}
                        title="Категорий пока нет"
                        hint="Категории помогают покупателям находить товары. Товары можно создавать и без них."
                        action={
                            <button type="button" className={btn.primary} onClick={openNew}>
                                Новая категория
                            </button>
                        }
                    />
                ) : (
                    <div className="overflow-x-auto">
                        <div role="table" aria-label="Категории" className="min-w-[820px] text-sm">
                            <div role="row" className={`${columns} ${tableHead} min-h-11`}>
                                <div role="columnheader">Название</div>
                                <div role="columnheader">Slug</div>
                                <div role="columnheader">Товаров</div>
                                <div role="columnheader">Обновлена</div>
                                <div role="columnheader" />
                            </div>
                            {categories.map((category) => (
                                <div
                                    key={category.ID}
                                    role="row"
                                    className={`${columns} min-h-16 border-b border-line py-2 last:border-b-0 hover:bg-wash`}
                                >
                                    <div role="cell" className="font-medium text-ink">
                                        {category.Name}
                                    </div>
                                    <div role="cell" className="tabular-nums">
                                        {category.Slug}
                                    </div>
                                    <div role="cell" className="text-muted">
                                        {productCount(category.ID)} шт.
                                    </div>
                                    <div role="cell" className="text-muted">
                                        {formatDateTime(category.UpdatedAt)}
                                    </div>
                                    <div role="cell" className="flex gap-2">
                                        <button
                                            type="button"
                                            className={iconBtn}
                                            aria-label={`Изменить категорию ${category.Name}`}
                                            onClick={() => setEditing(category)}
                                        >
                                            <Pencil size={20} />
                                        </button>
                                        <button
                                            type="button"
                                            className={iconBtnDanger}
                                            aria-label={`Удалить категорию ${category.Name}`}
                                            onClick={() => setToDelete(category)}
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </section>

            {editing !== null && (
                <CategoryModal
                    category={editing === 'new' ? null : editing}
                    categories={categories}
                    onClose={() => setEditing(null)}
                    onSaved={() => {
                        showToast(editing === 'new' ? 'Категория создана' : 'Категория сохранена');
                        setEditing(null);
                    }}
                />
            )}

            {toDelete && (
                <ConfirmDialog
                    title={`Удалить категорию «${toDelete.Name}»?`}
                    text={
                        deleteCount
                            ? `Товары останутся в каталоге, но будут без категории: ${deleteCount} шт.`
                            : 'В этой категории нет товаров.'
                    }
                    confirmLabel="Удалить"
                    pending={deleteCategory.isPending}
                    error={deleteCategory.isError ? 'Не удалось удалить категорию. Попробуйте ещё раз.' : undefined}
                    onConfirm={confirmDelete}
                    onCancel={() => {
                        setToDelete(null);
                        deleteCategory.reset();
                    }}
                />
            )}
        </main>
    );
}
