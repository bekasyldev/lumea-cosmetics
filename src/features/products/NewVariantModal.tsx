import { useState, type FormEvent } from 'react';
import { Loader2 } from 'lucide-react';
import type { Product } from '../../api/types';
import Field from '../../components/admin/Field';
import Modal from '../../components/admin/Modal';
import { btn, input, inputError } from '../../components/admin/ui';
import { formatMoney } from '../../lib/format';
import { useCreateVariant } from './queries';

interface NewVariantModalProps {
    product: Product;
    onClose: () => void;
    onCreated: () => void;
}

type Errors = Partial<Record<'name' | 'price' | 'wprice' | 'wmin' | 'form', string>>;

export default function NewVariantModal({ product, onClose, onCreated }: NewVariantModalProps) {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [wholesale, setWholesale] = useState(false);
    const [wholesalePrice, setWholesalePrice] = useState('');
    const [wholesaleMin, setWholesaleMin] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [errors, setErrors] = useState<Errors>({});
    const createVariant = useCreateVariant(product.ID);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const trimmedName = name.trim();
        const priceValue = Number(price);
        const wpValue = Number(wholesalePrice);
        const wmValue = Number(wholesaleMin);

        const nextErrors: Errors = {};
        if (!trimmedName) nextErrors.name = 'Укажите название';
        if (!(priceValue > 0)) nextErrors.price = 'Цена должна быть больше 0';
        if (wholesale) {
            if (!(wpValue > 0)) nextErrors.wprice = 'Укажите оптовую цену';
            else if (priceValue > 0 && wpValue >= priceValue) nextErrors.wprice = 'Оптовая цена должна быть меньше обычной';
            if (!(wmValue >= 2) || !Number.isInteger(wmValue)) nextErrors.wmin = 'Не меньше 2 шт.';
        }
        setErrors(nextErrors);
        if (Object.keys(nextErrors).length) return;

        createVariant.mutate(
            {
                Name: trimmedName,
                Price: priceValue,
                WholesalePrice: wholesale ? wpValue : null,
                WholesaleMinQty: wholesale ? wmValue : null,
                IsActive: isActive,
            },
            {
                onSuccess: onCreated,
                onError: () => setErrors({ form: 'Не удалось добавить вариант. Попробуйте ещё раз.' }),
            },
        );
    };

    const wholesaleHint =
        Number(wholesalePrice) > 0 && Number(wholesaleMin) >= 2
            ? `При заказе от ${wholesaleMin} шт. цена за штуку — ${formatMoney(Number(wholesalePrice))}.`
            : 'Цена за штуку при заказе от указанного количества. Должна быть ниже обычной.';

    return (
        <Modal
            title="Новый вариант"
            subtitle={`Товар: ${product.Name}`}
            onClose={onClose}
            onSubmit={handleSubmit}
            footer={
                <>
                    <button type="button" className={btn.secondary} onClick={onClose}>
                        Отмена
                    </button>
                    <button type="submit" className={btn.primary} disabled={createVariant.isPending}>
                        {createVariant.isPending && <Loader2 size={18} className="animate-spin" />}
                        Добавить вариант
                    </button>
                </>
            }
        >
            {errors.form && <p className="rounded-[14px] bg-danger-tint px-5 py-3.5 font-medium text-danger">{errors.form}</p>}

            <Field label="Название" htmlFor="vn-name" error={errors.name} hint="Например, «50 мл» или «Оттенок 02».">
                <input
                    id="vn-name"
                    autoFocus
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`${input} ${errors.name ? inputError : ''}`}
                />
            </Field>

            <Field label="Цена, ₸" htmlFor="vn-price" error={errors.price}>
                <input
                    id="vn-price"
                    type="number"
                    inputMode="numeric"
                    min={1}
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className={`${input} tabular-nums ${errors.price ? inputError : ''}`}
                />
            </Field>

            <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm">
                <input
                    type="checkbox"
                    checked={wholesale}
                    onChange={(e) => setWholesale(e.target.checked)}
                    className="size-5 accent-ink"
                />
                <span>Оптовая цена</span>
            </label>

            {wholesale && (
                <>
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(min(200px,100%),1fr))] gap-4">
                        <Field label="Оптовая цена, ₸" htmlFor="vn-wprice" error={errors.wprice}>
                            <input
                                id="vn-wprice"
                                type="number"
                                inputMode="numeric"
                                min={1}
                                value={wholesalePrice}
                                onChange={(e) => setWholesalePrice(e.target.value)}
                                className={`${input} tabular-nums ${errors.wprice ? inputError : ''}`}
                            />
                        </Field>
                        <Field label="От, шт." htmlFor="vn-wmin" error={errors.wmin}>
                            <input
                                id="vn-wmin"
                                type="number"
                                inputMode="numeric"
                                min={2}
                                value={wholesaleMin}
                                onChange={(e) => setWholesaleMin(e.target.value)}
                                className={`${input} tabular-nums ${errors.wmin ? inputError : ''}`}
                            />
                        </Field>
                    </div>
                    <p className="text-xs text-muted">{wholesaleHint}</p>
                </>
            )}

            <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm">
                <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="size-5 accent-ink"
                />
                <span>Доступен для заказа</span>
            </label>
        </Modal>
    );
}
