import { useMemo, useState } from 'react';
import { ChevronRight, Loader2, Search } from 'lucide-react';
import type { Order, OrderStatus } from '../../api/types';
import Chip from '../../components/admin/Chip';
import EmptyState from '../../components/admin/EmptyState';
import { btn, card, iconBtn, input, pageTitle, tableHead } from '../../components/admin/ui';
import { useOrders } from '../../features/orders/useOrders';
import { ORDER_STATUSES, orderStatusMeta } from '../../features/orders/orderStatus';
import OrderStatusBadge from '../../features/orders/OrderStatusBadge';
import { formatDateTime, formatMoney } from '../../lib/format';

type StatusFilter = OrderStatus | 'all';

const columns = 'grid grid-cols-[72px_minmax(180px,1.5fr)_150px_130px_140px_140px_44px] items-center gap-x-4 px-7';

function matchesSearch(order: Order, query: string) {
    const text = query.trim().toLowerCase();
    if (!text) return true;

    const number = text.replace(/^#/, '');
    if (/^\d+$/.test(number) && String(order.ID) === number) return true;

    const digits = text.replace(/\D/g, '');
    if (digits.length >= 3 && order.CustomerPhone.replace(/\D/g, '').includes(digits)) return true;

    return order.CustomerName.toLowerCase().includes(text);
}

export default function OrdersPage() {
    const { data: orders = [], isPending, isError, refetch } = useOrders();
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
    const [search, setSearch] = useState('');

    const counts = useMemo(() => {
        const result: Record<StatusFilter, number> = {
            all: orders.length,
            pending: 0,
            confirmed: 0,
            shipped: 0,
            delivered: 0,
            cancelled: 0,
        };
        for (const order of orders) {
            if (order.Status in result) result[order.Status]++;
        }
        return result;
    }, [orders]);

    const visibleOrders = useMemo(
        () =>
            orders.filter(
                (order) => (statusFilter === 'all' || order.Status === statusFilter) && matchesSearch(order, search),
            ),
        [orders, statusFilter, search],
    );

    const filters: { value: StatusFilter; label: string }[] = [
        { value: 'all', label: 'Все' },
        ...ORDER_STATUSES.map((status) => ({ value: status, label: orderStatusMeta[status].filterLabel })),
    ];

    const filterActive = statusFilter !== 'all' || search.trim() !== '';
    const resetFilters = () => {
        setStatusFilter('all');
        setSearch('');
    };

    return (
        <main className="flex flex-col gap-6 px-4 py-8 sm:px-10 lg:py-10">
            <header className="flex flex-col gap-1">
                <h1 className={pageTitle}>Заказы</h1>
                <p className="text-sm text-muted">
                    {counts.pending ? `Ждут подтверждения: ${counts.pending}` : 'Все заказы обработаны'}
                </p>
            </header>

            <div className="flex flex-wrap items-center justify-between gap-4">
                <div role="group" aria-label="Фильтр по статусу" className="flex flex-wrap gap-2">
                    {filters.map(({ value, label }) => (
                        <Chip
                            key={value}
                            active={statusFilter === value}
                            onClick={() => setStatusFilter(value)}
                            count={counts[value]}
                        >
                            {label}
                        </Chip>
                    ))}
                </div>

                <label className="relative max-w-[380px] flex-[1_1_280px]">
                    <span className="sr-only">Поиск по заказам</span>
                    <Search size={20} className="pointer-events-none absolute top-3 left-4 text-ink" />
                    <input
                        type="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Имя, телефон или номер"
                        className={`${input} rounded-full pl-[46px]`}
                    />
                </label>
            </div>

            <section className={`${card} overflow-hidden`}>
                {isPending ? (
                    <div className="flex justify-center py-16 text-ink">
                        <Loader2 className="animate-spin" />
                    </div>
                ) : isError ? (
                    <div className="py-16 text-center text-sm text-muted">
                        Не удалось загрузить заказы.{' '}
                        <button type="button" onClick={() => refetch()} className="font-medium text-ink underline">
                            Повторить
                        </button>
                    </div>
                ) : visibleOrders.length === 0 ? (
                    <EmptyState
                        title={orders.length ? 'Ничего не найдено' : 'Заказов пока нет'}
                        hint={
                            orders.length
                                ? 'Измените фильтр или поисковый запрос.'
                                : 'Новые заказы появятся здесь, когда клиенты оформят их на сайте.'
                        }
                        action={
                            orders.length > 0 &&
                            filterActive && (
                                <button type="button" className={btn.secondary} onClick={resetFilters}>
                                    Сбросить фильтры
                                </button>
                            )
                        }
                    />
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <div role="table" aria-label="Заказы" className="min-w-[1000px] text-sm">
                                <div role="row" className={`${columns} ${tableHead} min-h-11`}>
                                    <div role="columnheader">№</div>
                                    <div role="columnheader">Клиент</div>
                                    <div role="columnheader">Телефон</div>
                                    <div role="columnheader" className="text-right">
                                        Сумма
                                    </div>
                                    <div role="columnheader">Статус</div>
                                    <div role="columnheader">Создан</div>
                                    <div role="columnheader" />
                                </div>
                                {visibleOrders.map((order) => (
                                    <div
                                        key={order.ID}
                                        role="row"
                                        className={`${columns} min-h-16 border-b border-line py-2 last:border-b-0 hover:bg-wash`}
                                    >
                                        <div role="cell" className="tabular-nums">
                                            #{order.ID}
                                        </div>
                                        <div role="cell" className="font-medium text-ink">
                                            {order.CustomerName}
                                        </div>
                                        <div role="cell" className="tabular-nums">
                                            {order.CustomerPhone}
                                        </div>
                                        <div role="cell" className="text-right tabular-nums">
                                            {formatMoney(order.TotalPrice)}
                                        </div>
                                        <div role="cell">
                                            <OrderStatusBadge status={order.Status} />
                                        </div>
                                        <div role="cell" className="text-muted">
                                            {formatDateTime(order.CreatedAt)}
                                        </div>
                                        <div role="cell">
                                            {/* Order detail view is not built yet. */}
                                            <span aria-hidden="true" className={`${iconBtn} cursor-default hover:bg-transparent`}>
                                                <ChevronRight size={20} />
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <p className="border-t border-line px-7 py-4 text-xs text-muted">
                            Показано {visibleOrders.length} из {orders.length}
                        </p>
                    </>
                )}
            </section>
        </main>
    );
}
