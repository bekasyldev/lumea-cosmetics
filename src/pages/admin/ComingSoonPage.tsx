import { pageTitle } from '../../components/admin/ui';

// Placeholder for admin sections that aren't built yet.
export default function ComingSoonPage({ title }: { title: string }) {
    return (
        <main className="flex flex-col gap-1 px-4 py-8 sm:px-10 lg:py-10">
            <h1 className={pageTitle}>{title}</h1>
            <p className="text-sm text-muted">Раздел в разработке.</p>
        </main>
    );
}
