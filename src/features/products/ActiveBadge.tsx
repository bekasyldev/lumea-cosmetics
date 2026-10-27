import Badge from '../../components/admin/Badge';

// Status badge shared by products and variants.
export default function ActiveBadge({ active }: { active: boolean }) {
    return active ? <Badge tone="blue">Активен</Badge> : <Badge tone="hollow">Скрыт</Badge>;
}
