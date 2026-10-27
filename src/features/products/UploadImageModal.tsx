import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Loader2, Upload } from 'lucide-react';
import type { Product, ProductVariant } from '../../api/types';
import Chip from '../../components/admin/Chip';
import Field from '../../components/admin/Field';
import Modal from '../../components/admin/Modal';
import { btn } from '../../components/admin/ui';
import { useUploadImage } from './queries';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024;

interface UploadImageModalProps {
    product: Product;
    variants: ProductVariant[];
    onClose: () => void;
    onUploaded: () => void;
}

export default function UploadImageModal({ product, variants, onClose, onUploaded }: UploadImageModalProps) {
    const [file, setFile] = useState<File | null>(null);
    const [variantId, setVariantId] = useState<number | null>(null);
    const [fileError, setFileError] = useState('');
    const [formError, setFormError] = useState('');
    const upload = useUploadImage(product.ID);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const picked = e.target.files?.[0];
        if (!picked) return;

        let error = '';
        if (!ALLOWED_TYPES.includes(picked.type)) error = 'Допустимы JPEG, PNG, GIF и WebP';
        else if (picked.size > MAX_SIZE) error = 'Файл больше 5 МБ';

        setFile(error ? null : picked);
        setFileError(error);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!file) {
            setFileError((current) => current || 'Выберите файл');
            return;
        }
        setFormError('');
        upload.mutate(
            { file, variantId },
            {
                onSuccess: onUploaded,
                onError: () => setFormError('Не удалось загрузить фото. Попробуйте ещё раз.'),
            },
        );
    };

    return (
        <Modal
            title="Загрузить фото"
            subtitle={`Товар: ${product.Name}`}
            onClose={onClose}
            onSubmit={handleSubmit}
            footer={
                <>
                    <button type="button" className={btn.secondary} onClick={onClose}>
                        Отмена
                    </button>
                    <button type="submit" className={btn.primary} disabled={upload.isPending}>
                        {upload.isPending && <Loader2 size={18} className="animate-spin" />}
                        Загрузить
                    </button>
                </>
            }
        >
            {formError && <p className="rounded-[14px] bg-danger-tint px-5 py-3.5 font-medium text-danger">{formError}</p>}

            <div className="flex flex-col gap-1.5">
                {/* The transparent file input covers the whole drop zone, so click and drag-and-drop both work. */}
                <label
                    htmlFor="im-file"
                    className="relative flex cursor-pointer flex-col items-center gap-1.5 rounded-[14px] border-[1.5px] border-dashed border-[#e39ab7] bg-cream px-4 py-7 text-center text-ink focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ink"
                >
                    <input
                        id="im-file"
                        type="file"
                        accept={ALLOWED_TYPES.join(',')}
                        onChange={handleFileChange}
                        className="absolute inset-0 size-full cursor-pointer opacity-0"
                    />
                    <Upload size={28} />
                    <span className="text-sm font-medium">{file ? file.name : 'Выберите файл или перетащите сюда'}</span>
                    <span className="text-xs text-muted">JPEG, PNG, GIF или WebP, до 5 МБ</span>
                </label>
                {fileError && <p className="text-xs font-medium text-danger">{fileError}</p>}
            </div>

            <Field label="Для чего фото" hint="Новое фото добавляется в конец галереи.">
                <div role="group" aria-label="Для чего фото" className="flex flex-wrap gap-2">
                    <Chip active={variantId === null} onClick={() => setVariantId(null)}>
                        Весь товар
                    </Chip>
                    {variants.map((variant) => (
                        <Chip key={variant.ID} active={variantId === variant.ID} onClick={() => setVariantId(variant.ID)}>
                            {variant.Name}
                        </Chip>
                    ))}
                </div>
            </Field>
        </Modal>
    );
}
