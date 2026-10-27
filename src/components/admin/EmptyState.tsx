import type { ReactNode } from 'react';

interface EmptyStateProps {
    icon?: ReactNode;
    title: string;
    hint: string;
    action?: ReactNode;
    className?: string;
}

export default function EmptyState({ icon, title, hint, action, className = '' }: EmptyStateProps) {
    return (
        <div className={`flex flex-col items-center gap-2 px-6 py-14 text-center ${className}`}>
            {icon && (
                <span className="mb-2 inline-flex size-16 items-center justify-center rounded-full bg-mint text-ink">{icon}</span>
            )}
            <h2 className="font-display text-[28px] leading-[1.2] text-ink">{title}</h2>
            <p className="max-w-[400px] text-sm text-muted">{hint}</p>
            {action && <div className="mt-2">{action}</div>}
        </div>
    );
}
