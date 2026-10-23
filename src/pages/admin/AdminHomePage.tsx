import { LogOut } from 'lucide-react';
import { useAuth } from '../../features/auth/useAuth';

// Placeholder until the admin layout (orders, products, categories) is built.
export default function AdminHomePage() {
    const { signOut } = useAuth();

    return (
        <div className="min-h-screen bg-[#FFFBFC] px-4 py-8 font-ui text-[#33333D] sm:px-10">
            <header className="flex items-center justify-between">
                <span className="font-display text-3xl font-semibold italic text-[#E04F86]">Lumea</span>
                <button
                    type="button"
                    onClick={signOut}
                    className="flex items-center gap-2 rounded-full border border-[#E8A5C4] px-4 py-2 text-sm text-[#5A1A3A] hover:bg-[#FFE1EC]"
                >
                    <LogOut size={16} />
                    Выйти
                </button>
            </header>
            <main className="mt-16">
                <h1 className="font-display text-5xl font-medium text-[#5A1A3A]">Админка</h1>
                <p className="mt-3 text-sm text-[#6B5560]">Заказы, товары и категории появятся здесь.</p>
            </main>
        </div>
    );
}
