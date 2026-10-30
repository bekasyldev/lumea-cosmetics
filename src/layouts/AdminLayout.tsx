import { NavLink, Outlet } from 'react-router-dom';
import { LogOut, Package, ShoppingBag, Tag, Users, type LucideIcon } from 'lucide-react';
import ToastProvider from '../components/admin/toast/ToastProvider';
import { btn, iconBtn } from '../components/admin/ui';
import { useAuth } from '../features/auth/useAuth';
import { decodeToken } from '../features/auth/tokenStorage';
import { useOrders } from '../features/orders/useOrders';

interface NavItem {
    to: string;
    label: string;
    icon: LucideIcon;
}

const navItems: NavItem[] = [
    { to: '/admin/orders', label: 'Заказы', icon: ShoppingBag },
    { to: '/admin/products', label: 'Товары', icon: Package },
    { to: '/admin/categories', label: 'Категории', icon: Tag },
    { to: '/admin/users', label: 'Пользователи', icon: Users },
];

export default function AdminLayout() {
    const { token, signOut } = useAuth();
    const { data: orders } = useOrders();
    const pendingCount = orders?.filter((order) => order.Status === 'pending').length ?? 0;

    const username = (token && decodeToken(token)?.sub) || 'admin';

    return (
        <ToastProvider>
            <div className="admin-ui min-h-screen bg-cream font-ui text-sm text-charcoal lg:flex">
                <aside className="flex flex-col gap-6 border-b border-line bg-white px-4 py-4 lg:sticky lg:top-0 lg:h-screen lg:w-62 lg:shrink-0 lg:border-r lg:border-b-0 lg:py-6">
                    <div className="flex items-baseline gap-2 px-2">
                        <span className="font-display text-[32px] leading-none font-medium tracking-[-0.5px] text-brand-pink">
                            Lumea
                        </span>
                        <span className="text-xs text-muted">Админка</span>
                        <button type="button" onClick={signOut} aria-label="Выйти" className={`${iconBtn} ml-auto self-center lg:hidden`}>
                            <LogOut size={20} />
                        </button>
                    </div>

                    <nav aria-label="Разделы" className="scrollbar-hide -mx-4 flex gap-1 overflow-x-auto px-4 lg:mx-0 lg:flex-col lg:px-0">
                        {navItems.map(({ to, label, icon: Icon }) => (
                            <NavLink
                                key={to}
                                to={to}
                                className={({ isActive }) =>
                                    `flex min-h-11 shrink-0 items-center gap-3 rounded-full px-[18px] text-ink transition ${
                                        isActive ? 'bg-pink font-medium' : 'hover:bg-mint'
                                    }`
                                }
                            >
                                <Icon size={20} />
                                <span>{label}</span>
                                {to === '/admin/orders' && pendingCount > 0 && (
                                    <span
                                        aria-label={`Ждут подтверждения: ${pendingCount}`}
                                        className="ml-auto inline-flex h-[22px] min-w-[22px] items-center justify-center rounded-full bg-ink px-[7px] text-xs font-semibold text-cream"
                                    >
                                        {pendingCount}
                                    </span>
                                )}
                            </NavLink>
                        ))}
                    </nav>

                    <div className="mt-auto hidden flex-col gap-3 border-t border-line pt-4 lg:flex">
                        <div className="flex items-center gap-3 px-2">
                            <span
                                aria-hidden="true"
                                className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-lavender font-medium text-ink uppercase"
                            >
                                {username.charAt(0)}
                            </span>
                            <div className="min-w-0">
                                <p className="truncate font-medium text-ink">{username}</p>
                                <p className="text-xs text-muted">Администратор</p>
                            </div>
                        </div>
                        <button type="button" onClick={signOut} className={`${btn.ghost} justify-start`}>
                            <LogOut size={20} />
                            Выйти
                        </button>
                    </div>
                </aside>

                <div className="min-w-0 flex-1">
                    <Outlet />
                </div>
            </div>
        </ToastProvider>
    );
}
