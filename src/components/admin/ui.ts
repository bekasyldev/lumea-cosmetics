// Shared Tailwind class strings for the admin, matching the "Админка Lumea" design export.

const btnBase =
    'inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full border border-transparent px-6 text-sm whitespace-nowrap transition disabled:cursor-not-allowed disabled:opacity-60';

export const btn = {
    primary: `${btnBase} border-ink bg-ink text-cream hover:border-ink-hover hover:bg-ink-hover`,
    secondary: `${btnBase} border-ink bg-transparent text-ink hover:bg-mint`,
    ghost: `${btnBase} px-4 text-ink hover:bg-mint`,
    dangerSolid: `${btnBase} border-danger bg-danger text-cream hover:border-danger-hover hover:bg-danger-hover`,
};

export const iconBtn =
    'inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full text-ink transition hover:bg-mint disabled:cursor-not-allowed disabled:opacity-30';

export const iconBtnDanger = `${iconBtn} hover:bg-danger-tint hover:text-danger`;

export const input =
    'w-full min-h-11 rounded-[14px] border border-input-border bg-cream px-5 py-2.5 text-base text-charcoal outline-none placeholder:text-[#8a7480] focus:border-ink';

export const inputError = 'border-danger';

export const card = 'rounded-[14px] border border-line bg-white';

export const tableHead =
    'border-b border-line-strong text-[11px] font-semibold tracking-[0.08em] text-ink uppercase';

export const pageTitle = 'font-display text-5xl leading-[1.05] font-light tracking-[-0.03em] text-ink sm:text-[56px]';

export const sectionTitle = 'font-display text-[28px] leading-[1.2] tracking-[-0.2px] text-ink';
