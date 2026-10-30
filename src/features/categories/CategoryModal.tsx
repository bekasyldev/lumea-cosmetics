import { useState, type FormEvent } from 'react';
import { Loader2 } from 'lucide-react';
import { ApiError } from '../../api/client';
import type { Category } from '../../api/types';
import Field from '../../components/admin/Field';
import Modal from '../../components/admin/Modal';
import { btn, input, inputError } from '../../components/admin/ui';
import { slugify } from '../../lib/slugify';
import { useSaveCategory } from './useCategories';

interface CategoryModalProps {
    // The category being edited, or null to create a new one.
    category: Category | null;
    categories: Category[];
    onClose: () => void;
    onSaved: () => void;
}

type Errors = Partial<Record<'name' | 'slug' | 'form', string>>;

export default function CategoryModal({ category, categories, onClose, onSaved }: CategoryModalProps) {
    const [name, setName] = useState(category?.Name ?? '');
    const [slug, setSlug] = useState(category?.Slug ?? '');
    // When editing, keep the existing slug instead of regenerating it from the name.
    const [slugTouched, setSlugTouched] = useState(category !== null);
    const [errors, setErrors] = useState<Errors>({});
    const saveCategory = useSaveCategory();

    const isEdit = category !== null;

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
        else if (categories.some((item) => item.Slug === trimmedSlug && item.ID !== category?.ID)) {
            nextErrors.slug = 'Такой slug уже используется';
        }
        setErrors(nextErrors);
        if (Object.keys(nextErrors).length) return;

        saveCategory.mutate(
            { id: category?.ID ?? null, body: { Name: trimmedName, Slug: trimmedSlug } },
            {
                onSuccess: onSaved,
                onError: (error) => {
                    if (error instanceof ApiError && error.status === 409) {
                        setErrors({ slug: 'Такой slug уже используется' });
                    } else if (error instanceof ApiError && error.status === 404) {
                        setErrors({ form: 'Категория уже удалена.' });
                    } else {
                        setErrors({ form: 'Не удалось сохранить категорию. Попробуйте ещё раз.' });
                    }
                },
            },
        );
    };

    return (
        <Modal
            title={isEdit ? 'Изменить категорию' : 'Новая категория'}
            onClose={onClose}
            onSubmit={handleSubmit}
            showClose={false}
            footer={
                <>
                    <button type="button" className={btn.secondary} onClick={onClose}>
                        Отмена
                    </button>
                    <button type="submit" className={btn.primary} disabled={saveCategory.isPending}>
                        {saveCategory.isPending && <Loader2 size={18} className="animate-spin" />}
                        {isEdit ? 'Сохранить' : 'Создать'}
                    </button>
                </>
            }
        >
            {errors.form && <p className="rounded-[14px] bg-danger-tint px-5 py-3.5 font-medium text-danger">{errors.form}</p>}

            <Field label="Название" htmlFor="cg-name" error={errors.name}>
                <input
                    id="cg-name"
                    autoFocus
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className={`${input} ${errors.name ? inputError : ''}`}
                />
            </Field>

            <Field
                label="Slug"
                htmlFor="cg-slug"
                error={errors.slug}
                hint="Уникальный адрес категории. Приводится к нижнему регистру."
            >
                <input
                    id="cg-slug"
                    value={slug}
                    onChange={(e) => {
                        setSlug(e.target.value);
                        setSlugTouched(true);
                    }}
                    className={`${input} tabular-nums ${errors.slug ? inputError : ''}`}
                />
            </Field>
        </Modal>
    );
}
