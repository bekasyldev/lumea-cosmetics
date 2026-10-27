import type { ReactNode } from 'react';

export type BadgeTone = 'pink' | 'sky' | 'lavender' | 'blue' | 'ink' | 'hollow';

const toneClass: Record<BadgeTone, string> = {
    pink: 'bg-pink text-ink',
    sky: 'bg-sky text-ink',
    lavender: 'bg-lavender text-ink',
    blue: 'bg-blue text-ink',
    ink: 'bg-ink text-cream',
    hollow: 'border-hollow bg-transparent text-muted',
};

export default function Badge({ tone, children, className = '' }: { tone: BadgeTone; children: ReactNode; className?: string }) {
    return (
        <span
            className={`inline-flex items-center gap-2 rounded-full border border-transparent py-1 pr-3.5 pl-[11px] text-xs font-medium whitespace-nowrap ${toneClass[tone]} ${className}`}
        >
            <span
                aria-hidden="true"
                className={`size-[7px] shrink-0 rounded-full ${tone === 'hollow' ? 'border-[1.5px] border-hollow' : 'bg-current'}`}
            />
            {children}
        </span>
    );
}
