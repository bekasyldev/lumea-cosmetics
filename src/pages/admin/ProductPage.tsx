import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ImageIcon, Loader2, Package, Plus, Trash2, Upload } from 'lucide-react';
import { imageUrl } from '../../api/products';
import type { ProductImage } from '../../api/types';
import Badge from '../../components/admin/Badge';
import Chip from '../../components/admin/Chip';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import EmptyState from '../../components/admin/EmptyState';
import { useToast } from '../../components/admin/toast/useToast';
import { btn, card, iconBtnDanger, pageTitle, sectionTitle, tableHead } from '../../components/admin/ui';
import { useCategories } from '../../features/categories/useCategories';
import ActiveBadge from '../../features/products/ActiveBadge';
import NewVariantModal from '../../features/products/NewVariantModal';
import UploadImageModal from '../../features/products/UploadImageModal';
import { useDeleteImage, useProductImages, useProductVariants, useProducts } from '../../features/products/queries';
import { formatDateTime, formatMoney } from '../../lib/format';

const variantColumns = 'grid grid-cols-[minmax(150px,1.2fr)_130px_minmax(190px,1.4fr)_110px] items-center gap-x-4 px-7';

type Dialog = 'variant' | 'image' | null;

export default function ProductPage() {
    const productId = Number(useParams().id);
    const showToast = useToast();
    const { data: products, isPending, isError, refetch } = useProducts();
    const { data: categories = [] } = useCategories();
    const { data: variants = [], isPending: variantsPending } = useProductVariants(productId);
    const { data: images = [] } = useProductImages(productId);
    const deleteImage = useDeleteImage(productId);

    const [dialog, setDialog] = useState<Dialog>(null);
    // 'all' or a variant ID: a variant's photos plus the whole-product photos.
    const [photoFilter, setPhotoFilter] = useState<'all' | number>('all');
    const [imageToDelete, setImageToDelete] = useState<ProductImage | null>(null);

    // There is no GET /products/{id}; the product comes from the cached list.
    const product = products?.find((item) => item.ID === productId);

    const backLink = (
        <div>
            <Link to="/admin/products" className={`${btn.ghost} -ml-4`}>
                <ArrowLeft size={20} />
                Товары
            </Link>
        </div>
    );

    if (isPending || isError || !product) {
        return (
            <main className="flex flex-col gap-6 px-4 py-8 sm:px-10 lg:py-10">
                {backLink}
                {isPending ? (
                    <div className="flex justify-center py-16 text-ink">
                        <Loader2 className="animate-spin" />
                    </div>
                ) : isError ? (
                    <div className="py-16 text-center text-sm text-muted">
                        Не удалось загрузить товар.{' '}
                        <button type="button" onClick={() => refetch()} className="font-medium text-ink underline">
                            Повторить
                        </button>
                    </div>
                ) : (
                    <EmptyState icon={<Package size={28} />} title="Товар не найден" hint="Возможно, ссылка устарела." />
                )}
            </main>
        );
    }

    const categoryName = categories.find((category) => category.ID === product.CategoryID)?.Name ?? 'Без категории';
    const activeVariants = variants.filter((variant) => variant.IsActive).length;
    const variantName = (id: number) => variants.find((variant) => variant.ID === id)?.Name ?? 'Вариант';

    const shownImages =
        photoFilter === 'all'
            ? images
            : images.filter((image) => image.VariantID === null || image.VariantID === photoFilter);

    const photosCaption = images.length
        ? photoFilter === 'all'
            ? 'Первое фото — главное'
            : 'Фото варианта и общие фото товара'
        : 'Нет фото';

    const confirmDelete = () => {
        if (!imageToDelete) return;
        deleteImage.mutate(imageToDelete.ID, {
            onSuccess: () => {
                setImageToDelete(null);
                showToast('Фото удалено');
            },
        });
    };

    return (
        <main className="flex flex-col gap-6 px-4 py-8 sm:px-10 lg:py-10">
            {backLink}

            <header className="flex flex-col gap-2">
                <div className="flex flex-wrap items-center gap-3">
                    <h1 className={pageTitle}>{product.Name}</h1>
                    <ActiveBadge active={product.IsActive} />
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                    <span className="text-xs text-muted tabular-nums">{product.Slug}</span>
                    <span className="text-muted">{categoryName}</span>
                    <span className="text-muted">Создан {formatDateTime(product.CreatedAt)}</span>
                </div>
                <p className="max-w-[640px] text-sm text-[#111111]">{product.Description || 'Описание не заполнено.'}</p>
            </header>

            <section className={`${card} overflow-hidden`}>
                <div className="flex flex-wrap items-center justify-between gap-3 px-7 pt-7 pb-[18px]">
                    <div className="flex flex-col gap-0.5">
                        <h2 className={sectionTitle}>Варианты</h2>
                        <span className="text-xs text-muted">
                            {variants.length ? `Всего: ${variants.length} · активных: ${activeVariants}` : 'Нет вариантов'}
                        </span>
                    </div>
                    <button type="button" className={btn.primary} onClick={() => setDialog('variant')}>
                        <Plus size={20} />
                        Добавить вариант
                    </button>
                </div>

                {variantsPending ? (
                    <div className="flex justify-center border-t border-line py-10 text-ink">
                        <Loader2 className="animate-spin" />
                    </div>
                ) : variants.length === 0 ? (
                    <EmptyState
                        className="border-t border-line"
                        title="Вариантов пока нет"
                        hint="Заказать можно только активный вариант с ценой. Добавьте первый — например, объём или оттенок."
                    />
                ) : (
                    <div className="overflow-x-auto">
                        <div role="table" aria-label="Варианты" className="min-w-[680px] text-sm">
                            <div role="row" className={`${variantColumns} ${tableHead} min-h-11`}>
                                <div role="columnheader">Вариант</div>
                                <div role="columnheader" className="text-right">
                                    Цена
                                </div>
                                <div role="columnheader">Опт</div>
                                <div role="columnheader">Статус</div>
                            </div>
                            {variants.map((variant) => (
                                <div
                                    key={variant.ID}
                                    role="row"
                                    className={`${variantColumns} min-h-16 border-b border-line py-2 last:border-b-0`}
                                >
                                    <div role="cell" className="font-medium text-ink">
                                        {variant.Name}
                                    </div>
                                    <div role="cell" className="text-right tabular-nums">
                                        {formatMoney(variant.Price)}
                                    </div>
                                    <div role="cell" className="tabular-nums">
                                        {variant.WholesalePrice !== null
                                            ? `от ${variant.WholesaleMinQty} шт — ${formatMoney(variant.WholesalePrice)}`
                                            : '—'}
                                    </div>
                                    <div role="cell">
                                        <ActiveBadge active={variant.IsActive} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </section>

            <section className={`${card} overflow-hidden`}>
                <div className="flex flex-wrap items-center justify-between gap-3 px-7 pt-7 pb-[18px]">
                    <div className="flex flex-col gap-0.5">
                        <h2 className={sectionTitle}>Фото</h2>
                        <span className="text-xs text-muted">{photosCaption}</span>
                    </div>
                    <button type="button" className={btn.secondary} onClick={() => setDialog('image')}>
                        <Upload size={20} />
                        Загрузить фото
                    </button>
                </div>

                {variants.length > 0 && (
                    <div role="group" aria-label="Показать фото" className="flex flex-wrap gap-2 px-5 pb-4">
                        <Chip active={photoFilter === 'all'} onClick={() => setPhotoFilter('all')}>
                            Все фото товара
                        </Chip>
                        {variants.map((variant) => (
                            <Chip key={variant.ID} active={photoFilter === variant.ID} onClick={() => setPhotoFilter(variant.ID)}>
                                {variant.Name}
                            </Chip>
                        ))}
                    </div>
                )}

                {shownImages.length === 0 ? (
                    <EmptyState
                        className="border-t border-line"
                        icon={<ImageIcon size={28} />}
                        title="Фото пока нет"
                        hint="Первое загруженное фото станет главным на карточке товара."
                    />
                ) : (
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(168px,1fr))] gap-4 px-5 pt-1 pb-5">
                        {shownImages.map((image, i) => (
                            <div key={image.ID} className="flex min-w-0 flex-col gap-2">
                                <div className="relative">
                                    <ImageTile image={image} />
                                    {i === 0 && (
                                        <Badge tone="pink" className="absolute top-2 left-2">
                                            Главное
                                        </Badge>
                                    )}
                                </div>
                                <div className="flex items-center justify-between gap-1">
                                    <div className="min-w-0">
                                        <div className="truncate text-sm font-medium text-ink">
                                            {image.VariantID === null ? 'Весь товар' : variantName(image.VariantID)}
                                        </div>
                                        <div className="text-xs text-muted">
                                            №{i + 1} · {image.ContentType.replace('image/', '').toUpperCase()}
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        className={iconBtnDanger}
                                        aria-label={`Удалить фото №${i + 1}`}
                                        onClick={() => setImageToDelete(image)}
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {dialog === 'variant' && (
                <NewVariantModal
                    product={product}
                    onClose={() => setDialog(null)}
                    onCreated={() => {
                        setDialog(null);
                        showToast('Вариант добавлен');
                    }}
                />
            )}

            {dialog === 'image' && (
                <UploadImageModal
                    product={product}
                    variants={variants}
                    onClose={() => setDialog(null)}
                    onUploaded={() => {
                        setDialog(null);
                        showToast('Фото загружено');
                    }}
                />
            )}

            {imageToDelete && (
                <ConfirmDialog
                    title="Удалить фото?"
                    text="Фото исчезнет из галереи товара."
                    confirmLabel="Удалить"
                    pending={deleteImage.isPending}
                    error={deleteImage.isError ? 'Не удалось удалить фото. Попробуйте ещё раз.' : undefined}
                    onConfirm={confirmDelete}
                    onCancel={() => {
                        setImageToDelete(null);
                        deleteImage.reset();
                    }}
                />
            )}
        </main>
    );
}

// Shows the S3 image, falling back to the design's placeholder if the bucket isn't reachable.
function ImageTile({ image }: { image: ProductImage }) {
    const [failed, setFailed] = useState(false);

    if (failed) {
        return (
            <div aria-hidden="true" className="flex aspect-square w-full items-center justify-center rounded-[14px] bg-mint text-[#9a5a78]">
                <ImageIcon size={32} strokeWidth={1.5} />
            </div>
        );
    }

    return (
        <img
            src={imageUrl(image)}
            alt=""
            loading="lazy"
            onError={() => setFailed(true)}
            className="aspect-square w-full rounded-[14px] bg-mint object-cover"
        />
    );
}
