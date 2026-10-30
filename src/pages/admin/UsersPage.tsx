import { Loader2, Users } from 'lucide-react';
import Badge from '../../components/admin/Badge';
import EmptyState from '../../components/admin/EmptyState';
import { card, pageTitle, tableHead } from '../../components/admin/ui';
import { useUsers } from '../../features/users/useUsers';
import { formatDateTime } from '../../lib/format';

const columns = 'grid grid-cols-[minmax(200px,1.5fr)_90px_150px_170px] items-center gap-x-4 px-7';

export default function UsersPage() {
    const { data: users = [], isPending, isError, refetch } = useUsers();

    return (
        <main className="flex flex-col gap-6 px-4 py-8 sm:px-10 lg:py-10">
            <header className="flex flex-col gap-1">
                <h1 className={pageTitle}>Пользователи</h1>
                <p className="text-sm text-muted">Всего: {users.length}</p>
            </header>

            <section className={`${card} overflow-hidden`}>
                {isPending ? (
                    <div className="flex justify-center py-16 text-ink">
                        <Loader2 className="animate-spin" />
                    </div>
                ) : isError ? (
                    <div className="py-16 text-center text-sm text-muted">
                        Не удалось загрузить пользователей.{' '}
                        <button type="button" onClick={() => refetch()} className="font-medium text-ink underline">
                            Повторить
                        </button>
                    </div>
                ) : users.length === 0 ? (
                    <EmptyState
                        icon={<Users size={28} />}
                        title="Пользователей пока нет"
                        hint="Здесь появятся зарегистрированные пользователи."
                    />
                ) : (
                    <div className="overflow-x-auto">
                        <div role="table" aria-label="Пользователи" className="min-w-[700px] text-sm">
                            <div role="row" className={`${columns} ${tableHead} min-h-11`}>
                                <div role="columnheader">Логин</div>
                                <div role="columnheader">ID</div>
                                <div role="columnheader">Роль</div>
                                <div role="columnheader">Регистрация</div>
                            </div>
                            {users.map((user) => (
                                <div
                                    key={user.ID}
                                    role="row"
                                    className={`${columns} min-h-16 border-b border-line py-2 last:border-b-0`}
                                >
                                    <div role="cell" className="flex min-w-0 items-center gap-3">
                                        <span
                                            aria-hidden="true"
                                            className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-lavender font-medium text-ink uppercase"
                                        >
                                            {user.Username.charAt(0)}
                                        </span>
                                        <span className="truncate font-medium text-ink">{user.Username}</span>
                                    </div>
                                    <div role="cell" className="tabular-nums">
                                        {user.ID}
                                    </div>
                                    <div role="cell">
                                        {user.Role === 'admin' ? (
                                            <Badge tone="lavender">Администратор</Badge>
                                        ) : (
                                            <Badge tone="sky">Пользователь</Badge>
                                        )}
                                    </div>
                                    <div role="cell" className="text-muted">
                                        {formatDateTime(user.CreatedAt)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </section>
        </main>
    );
}
