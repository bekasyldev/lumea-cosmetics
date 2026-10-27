import { useState, type FormEvent } from 'react';
import { Loader2 } from 'lucide-react';
import { ApiError } from '../../api/client';
import type { Category, Product } from '../../api/types';
import Chip from '../../components/admin/Chip';
import Field from '../../components/admin/Field';
import Modal from '../../components/admin/Modal';
import { btn, input, inputError } from '../../components/admin/ui';
import { slugify } from '../../lib/slugify';
import { useCreateProduct } from './queries';

interface NewProductModalProps {
    categories: Category[];
    products: Product[];
    onClose: () => void;
    onCreated: (product: Product | undefined) => void;
}

type Errors = Partial<Record<'name' | 'slug' | 'form', string>>;

export default function NewProductModal({ categories, products, onClose, onCreated }: NewProductModalProps) {
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [slugTouched, setSlugTouched] = useState(false);
    const [categoryId, setCategoryId] = useState<number | null>(null);
    const [description, setDescription] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [errors, setErrors] = useState<Errors>({});
    const createProduct = useCreateProduct();

    const handleNameChange = (value: string) => {
        setName(value);
        if (!slugTouched) setSlug(slugify(value));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const trimmedName = name.trim();
        const trimmedSlug = slug.trim().toLowerCase();

        const nextErrors: Errors = {};
        if (!trimmedName) nextErrors.name = 'Укажите название';
        if (!trimmedSlug) nextErrors.slug = 'Укажите slug';
        else if (products.some((product) => product.Slug === trimmedSlug)) nextErrors.slug = 'Такой slug уже используется';
        setErrors(nextErrors);
        if (Object.keys(nextErrors).length) return;

        createProduct.mutate(
            { Name: trimmedName, Slug: trimmedSlug, Description: description.trim(), CategoryID: categoryId, IsActive: isActive },
            {
                onSuccess: onCreated,
                onError: (error) => {
                    // The backend answers 400 "slug alreday in use" for duplicates.
                    if (error instanceof ApiError && error.status === 400 && /slug/i.test(error.message)) {
                        setErrors({ slug: 'Такой slug уже используется' });
                    } else {
                        setErrors({ form: 'Не удалось создать товар. Попробуйте ещё раз.' });
                    }
                },
            },
        );
    };

    return (
        <Modal
            title="Новый товар"
            onClose={onClose}
            onSubmit={handleSubmit}
            footer={
                <>
                    <button type="button" className={btn.secondary} onClick={onClose}>
                        Отмена
                    </button>
                    <button type="submit" className={btn.primary} disabled={createProduct.isPending}>
                        {createProduct.isPending && <Loader2 size={18} className="animate-spin" />}
                        Создать товар
                    </button>
                </>
            }
        >
            {errors.form && <p className="rounded-[14px] bg-danger-tint px-5 py-3.5 font-medium text-danger">{errors.form}</p>}

            <Field label="Название" htmlFor="pn-name" error={errors.name}>
                <input
                    id="pn-name"
                    autoFocus
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className={`${input} ${errors.name ? inputError : ''}`}
                />
            </Field>

            <Field
                label="Slug"
                htmlFor="pn-slug"
                error={errors.slug}
                hint="Уникальный адрес товара. Заполняется по названию, можно изменить."
            >
                <input
                    id="pn-slug"
                    value={slug}
                    onChange={(e) => {
                        setSlug(e.target.value);
                        setSlugTouched(true);
                    }}
                    className={`${input} tabular-nums ${errors.slug ? inputError : ''}`}
                />
            </Field>

            <Field label="Категория">
                <div role="group" aria-label="Категория" className="flex flex-wrap gap-2">
                    <Chip active={categoryId === null} onClick={() => setCategoryId(null)}>
                        Без категории
                    </Chip>
                    {categories.map((category) => (
                        <Chip key={category.ID} active={categoryId === category.ID} onClick={() => setCategoryId(category.ID)}>
                            {category.Name}
                        </Chip>
                    ))}
                </div>
            </Field>

            <Field label="Описание" htmlFor="pn-desc">
                <textarea
                    id="pn-desc"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className={`${input} min-h-24 resize-y`}
                />
            </Field>

            <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm">
                <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="size-5 accent-ink"
                />
                <span>Показывать покупателям</span>
            </label>
        </Modal>
    );
}
