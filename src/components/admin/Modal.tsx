import { useEffect, type FormEvent, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { iconBtn } from './ui';

interface ModalProps {
    title: string;
    subtitle?: string;
    onClose: () => void;
    // When set, the modal is a <form> and the footer's submit button submits it.
    onSubmit?: (e: FormEvent<HTMLFormElement>) => void;
    footer: ReactNode;
    children?: ReactNode;
    role?: 'dialog' | 'alertdialog';
    size?: 'md' | 'sm';
    showClose?: boolean;
}

export default function Modal({
    title,
    subtitle,
    onClose,
    onSubmit,
    footer,
    children,
    role = 'dialog',
    size = 'md',
    showClose = true,
}: ModalProps) {
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [onClose]);

    const containerProps = {
        role,
        'aria-modal': true,
        'aria-label': title,
        className: `max-h-full w-full overflow-auto rounded-[14px] bg-cream ${size === 'sm' ? 'max-w-[440px]' : 'max-w-[520px]'}`,
    };

    const content = (
        <>
            <div className="flex items-start justify-between gap-3 px-7 pt-7 pb-2">
                <div className="flex flex-col gap-0.5">
                    <h2 className="font-display text-[40px] leading-[1.1] font-light tracking-[-0.4px] text-ink">{title}</h2>
                    {subtitle && <p className="text-sm text-muted">{subtitle}</p>}
                </div>
                {showClose && (
                    <button type="button" className={iconBtn} aria-label="Закрыть" onClick={onClose}>
                        <X size={20} />
                    </button>
                )}
            </div>
            {children && <div className="flex flex-col gap-4 px-7 pt-2">{children}</div>}
            <div className="flex flex-wrap justify-end gap-3 p-7">{footer}</div>
        </>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-[rgba(90,27,59,0.45)] p-4">
            {onSubmit ? (
                // Validation is done in JS with the design's messages, not by the browser.
                <form {...containerProps} onSubmit={onSubmit} noValidate>
                    {content}
                </form>
            ) : (
                <div {...containerProps}>{content}</div>
            )}
        </div>
    );
}
