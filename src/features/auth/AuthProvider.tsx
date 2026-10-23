import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { AuthContext } from './AuthContext';
import { msUntilExpiry, tokenStorage } from './tokenStorage';

// setTimeout overflows above ~24.8 days; tokens here live minutes, but clamp anyway.
const MAX_TIMEOUT = 2_147_483_647;

export default function AuthProvider({ children }: { children: ReactNode }) {
    const queryClient = useQueryClient();
    const [token, setToken] = useState<string | null>(() => tokenStorage.get());

    // Stay in sync with token changes from outside React (e.g. apiFetch clearing it on 401).
    useEffect(() => tokenStorage.subscribe(setToken), []);

    // Log out automatically when the access token expires (backend has no refresh endpoint).
    useEffect(() => {
        if (!token) {
            queryClient.clear();
            return;
        }
        const timeout = setTimeout(() => tokenStorage.clear(), Math.min(msUntilExpiry(token), MAX_TIMEOUT));
        return () => clearTimeout(timeout);
    }, [token, queryClient]);

    const signIn = useCallback((newToken: string) => tokenStorage.set(newToken), []);
    const signOut = useCallback(() => tokenStorage.clear(), []);

    const value = useMemo(
        () => ({ token, isAuthenticated: token !== null, signIn, signOut }),
        [token, signIn, signOut],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
