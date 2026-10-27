import type { ReactNode } from 'react';

interface FieldProps {
    label: string;
    htmlFor?: string;
    error?: string;
    hint?: ReactNode;
    children: ReactNode;
}

export default function Field({ label, htmlFor, error, hint, children }: FieldProps) {
    return (
        <div className="flex flex-col gap-1.5">
            {htmlFor ? (
                <label htmlFor={htmlFor} className="text-sm font-medium text-ink">
                    {label}
                </label>
            ) : (
                <span className="text-sm font-medium text-ink">{label}</span>
            )}
            {children}
            {error && <p className="text-xs font-medium text-danger">{error}</p>}
            {hint && <p className="text-xs text-muted">{hint}</p>}
        </div>
    );
}
