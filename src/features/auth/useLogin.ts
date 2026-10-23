import { useMutation } from '@tanstack/react-query';
import { login } from '../../api/auth';
import { ApiError } from '../../api/client';
import { decodeToken } from './tokenStorage';
import { useAuth } from './useAuth';

interface Credentials {
    username: string;
    password: string;
}

export function useLogin() {
    const { signIn } = useAuth();

    return useMutation({
        mutationFn: async ({ username, password }: Credentials) => {
            const { access_token } = await login(username, password);
            // Only admins may enter the admin panel (when the token carries a role claim).
            const role = decodeToken(access_token)?.role;
            if (role !== undefined && role !== 'admin') throw new ApiError(403, 'forbidden');
            return access_token;
        },
        onSuccess: signIn,
    });
}

export function loginErrorMessage(error: unknown): string {
    if (error instanceof ApiError) {
        if (error.status === 400 || error.status === 401) return 'Неверный логин или пароль';
        if (error.status === 403) return 'Нет доступа к админке';
    }
    return 'Сервер недоступен, попробуйте позже';
}
