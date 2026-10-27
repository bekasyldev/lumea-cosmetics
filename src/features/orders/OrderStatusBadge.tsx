import type { OrderStatus } from '../../api/types';
import Badge from '../../components/admin/Badge';
import { orderStatusMeta } from './orderStatus';

export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
    // Unknown statuses from the backend fall back to a neutral badge.
    const meta = orderStatusMeta[status];
    return <Badge tone={meta?.tone ?? 'hollow'}>{meta?.label ?? status}</Badge>;
}
