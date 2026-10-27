import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { Check } from 'lucide-react';
import { ToastContext } from './ToastContext';

const TOAST_DURATION = 3500;

export default function ToastProvider({ children }: { children: ReactNode }) {
    const [message, setMessage] = useState('');
    const timeout = useRef<ReturnType<typeof setTimeout>>(undefined);

    const showToast = useCallback((text: string) => {
        clearTimeout(timeout.current);
        setMessage(text);
        timeout.current = setTimeout(() => setMessage(''), TOAST_DURATION);
    }, []);

    useEffect(() => () => clearTimeout(timeout.current), []);

    return (
        <ToastContext.Provider value={showToast}>
            {children}
            {message && (
                <div
                    role="status"
                    className="fixed bottom-6 left-1/2 z-60 flex max-w-[calc(100%-32px)] -translate-x-1/2 items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm text-cream"
                >
                    <Check size={18} strokeWidth={2.5} className="shrink-0 text-pink" />
                    {message}
                </div>
            )}
        </ToastContext.Provider>
    );
}
