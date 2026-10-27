import type { ReactNode } from 'react';

interface ChipProps {
    active: boolean;
    onClick: () => void;
    children: ReactNode;
    count?: number;
}

export default function Chip({ active, onClick, children, count }: ChipProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={active}
            className={`inline-flex min-h-11 shrink-0 cursor-pointer items-center gap-2 rounded-full border px-5 text-sm whitespace-nowrap text-ink transition ${
                active ? 'border-pink bg-pink font-medium' : 'border-line bg-cream hover:border-mint hover:bg-mint'
            }`}
        >
            {children}
            {count !== undefined && (
                <span className={`text-xs font-medium ${active ? 'text-ink' : 'text-muted'}`}>{count}</span>
            )}
        </button>
    );
}
