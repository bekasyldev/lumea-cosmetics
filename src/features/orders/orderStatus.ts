import type { OrderStatus } from '../../api/types';
import type { BadgeTone } from '../../components/admin/Badge';

interface StatusMeta {
    // Singular, for the badge ("Ожидает").
    label: string;
    // Plural, for the filter chip ("Ожидают").
    filterLabel: string;
    tone: BadgeTone;
}

export const ORDER_STATUSES: OrderStatus[] = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

export const orderStatusMeta: Record<OrderStatus, StatusMeta> = {
    pending: { label: 'Ожидает', filterLabel: 'Ожидают', tone: 'pink' },
    confirmed: { label: 'Подтверждён', filterLabel: 'Подтверждены', tone: 'sky' },
    shipped: { label: 'Отправлен', filterLabel: 'Отправлены', tone: 'lavender' },
    delivered: { label: 'Доставлен', filterLabel: 'Доставлены', tone: 'ink' },
    cancelled: { label: 'Отменён', filterLabel: 'Отменены', tone: 'hollow' },
};
