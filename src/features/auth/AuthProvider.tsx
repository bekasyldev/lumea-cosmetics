import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { refreshToken } from '../../api/auth';
import { ApiError } from '../../api/client';
import { AuthContext } from './AuthContext';
import { msUntilExpiry, tokenStorage } from './tokenStorage';

// setTimeout overflows above ~24.8 days; tokens here live minutes, but clamp anyway.
const MAX_TIMEOUT = 2_147_483_647;
// Refresh this long before the access token expires.
const REFRESH_MARGIN = 30_000;
// Retry delay after a transient refresh failure (network error, 5xx).
const RETRY_DELAY = 10_000;

export default function AuthProvider({ children }: { children: ReactNode }) {
    const queryClient = useQueryClient();
    const [token, setToken] = useState<string | null>(() => tokenStorage.get());

    // Stay in sync with token changes from outside React (e.g. apiFetch clearing it on 401).
    useEffect(() => tokenStorage.subscribe(setToken), []);

    // Refresh the access token shortly before it expires; log out if the refresh token is rejected
    // or the token expires without a successful refresh.
    useEffect(() => {
        if (!token) {
            queryClient.clear();
            return;
        }

        let cancelled = false;
        let timeout: ReturnType<typeof setTimeout>;

        const schedule = (delay: number) => {
            timeout = setTimeout(refresh, Math.min(Math.max(delay, 0), MAX_TIMEOUT));
        };

        const refresh = async () => {
            try {
                const { access_token } = await refreshToken();
                // A new token re-runs this effect and schedules the next refresh.
                if (!cancelled) tokenStorage.set(access_token);
            } catch (error) {
                if (cancelled) return;
                const remaining = msUntilExpiry(token);
                if ((error instanceof ApiError && error.status === 401) || remaining <= RETRY_DELAY) {
                    tokenStorage.clear();
                } else {
                    schedule(RETRY_DELAY);
                }
            }
        };

        const remaining = msUntilExpiry(token);
        // Tokens without exp never expire; short-lived ones refresh at half their remaining life.
        if (remaining !== Infinity) schedule(Math.max(remaining - REFRESH_MARGIN, remaining / 2));

        return () => {
            cancelled = true;
            clearTimeout(timeout);
        };
    }, [token, queryClient]);

    const signIn = useCallback((newToken: string) => tokenStorage.set(newToken), []);
    const signOut = useCallback(() => tokenStorage.clear(), []);

    const value = useMemo(
        () => ({ token, isAuthenticated: token !== null, signIn, signOut }),
        [token, signIn, signOut],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
