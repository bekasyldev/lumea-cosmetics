import { useState, type FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../../features/auth/useAuth';
import { loginErrorMessage, useLogin } from '../../features/auth/useLogin';

const inputClass =
    'h-12 w-full rounded-2xl border border-input-border bg-white px-4 text-charcoal outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/15';

export default function LoginPage() {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = (location.state as { from?: string } | null)?.from ?? '/admin';

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const loginMutation = useLogin();

    if (isAuthenticated && !loginMutation.isSuccess) return <Navigate to={from} replace />;

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        loginMutation.mutate(
            { username: username.trim(), password },
            { onSuccess: () => navigate(from, { replace: true }) },
        );
    };

    return (
        <div className="admin-ui min-h-screen bg-cream font-ui text-charcoal lg:grid lg:grid-cols-2 lg:gap-4 lg:p-4">
            <div className="flex min-h-screen flex-col px-4 py-8 sm:px-10 lg:min-h-0 lg:px-[4.5rem] lg:py-6">
                <main className="flex flex-1 items-center py-12">
                    <div className="w-full max-w-[440px]">
                        <h1 className="font-display text-5xl leading-tight font-medium text-ink sm:text-6xl">
                            Вход в админку
                        </h1>
                        <p className="mt-3 text-sm text-muted">Заказы, товары и категории магазина.</p>

                        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                            <div>
                                <label htmlFor="username" className="mb-2 block text-sm font-medium text-ink">
                                    Логин
                                </label>
                                <input
                                    id="username"
                                    name="username"
                                    autoComplete="username"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className={inputClass}
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="mb-2 block text-sm font-medium text-ink">
                                    Пароль
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        autoComplete="current-password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className={`${inputClass} pr-12`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((v) => !v)}
                                        aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
                                        className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-ink hover:opacity-70"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            {loginMutation.isError && (
                                <p role="alert" className="text-sm text-danger">
                                    {loginErrorMessage(loginMutation.error)}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={loginMutation.isPending}
                                className="flex h-13 w-full items-center justify-center gap-2 rounded-full bg-ink font-medium text-white transition hover:bg-ink-hover disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {loginMutation.isPending && <Loader2 size={18} className="animate-spin" />}
                                Войти
                            </button>
                        </form>
                    </div>
                </main>

                <p className="text-sm text-muted">Сессия действует 15 минут, затем нужно войти снова.</p>
            </div>

            <LoginVisual />
        </div>
    );
}

function LoginVisual() {
    const [imageFailed, setImageFailed] = useState(false);

    return (
        <aside className="relative hidden overflow-hidden rounded-3xl bg-[#FBC6DB] lg:block">
            {imageFailed ? (
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-display text-[10rem] leading-none text-ink select-none">Lumea</span>
                </div>
            ) : (
                <img
                    src="/images/admin-login.jpg"
                    alt=""
                    onError={() => setImageFailed(true)}
                    className="absolute inset-0 h-full w-full object-cover"
                />
            )}
            <span className="absolute bottom-7 left-7 rounded-full bg-white px-4 py-2 text-xs font-semibold tracking-wider text-ink">
                КОСМЕТИКА · АЛМАТЫ
            </span>
        </aside>
    );
}
