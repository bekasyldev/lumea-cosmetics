import { Loader2 } from 'lucide-react';
import Modal from './Modal';
import { btn } from './ui';

interface ConfirmDialogProps {
    title: string;
    text: string;
    confirmLabel: string;
    onConfirm: () => void;
    onCancel: () => void;
    pending?: boolean;
    error?: string;
}

export default function ConfirmDialog({ title, text, confirmLabel, onConfirm, onCancel, pending, error }: ConfirmDialogProps) {
    return (
        <Modal
            title={title}
            onClose={onCancel}
            role="alertdialog"
            size="sm"
            showClose={false}
            footer={
                <>
                    <button type="button" className={btn.secondary} onClick={onCancel}>
                        Отмена
                    </button>
                    <button type="button" className={btn.dangerSolid} onClick={onConfirm} disabled={pending}>
                        {pending && <Loader2 size={18} className="animate-spin" />}
                        {confirmLabel}
                    </button>
                </>
            }
        >
            <p className="text-base text-muted">{text}</p>
            {error && <p className="rounded-[14px] bg-danger-tint px-5 py-3.5 font-medium text-danger">{error}</p>}
        </Modal>
    );
}
