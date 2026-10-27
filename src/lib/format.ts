const priceFormatter = new Intl.NumberFormat('ru-RU');
const dayFormatter = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'short' });
const timeFormatter = new Intl.DateTimeFormat('ru-RU', { hour: '2-digit', minute: '2-digit' });

// 24000 → "24 000 ₸"
export function formatMoney(value: number) {
    return `${priceFormatter.format(value)} ₸`;
}

// ISO timestamp → "23 окт., 13:52"
export function formatDateTime(value: string) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '—';
    return `${dayFormatter.format(date)}, ${timeFormatter.format(date)}`;
}
