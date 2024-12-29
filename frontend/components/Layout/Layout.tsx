'use client';

import Link from 'next/link';
import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const Layout = ({ children }: { children: React.ReactNode }) => {
    const { user, logout } = useContext(AuthContext);
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    return (
        <div className="min-h-screen flex flex-col">
            <header className="bg-gray-800 text-white p-4 flex justify-between">
                <Link href={user ? '/dashboard' : '/'} className="text-xl font-bold">
                    DiscordLikeApp
                </Link>
                <nav>
                    {user ? (
                        <button onClick={handleLogout} className="text-white underline">
                            ログアウト
                        </button>
                    ) : (
                        <>
                            <Link href="/login" className="mr-4">
                                ログイン
                            </Link>
                            <Link href="/register">
                                登録
                            </Link>
                        </>
                    )}
                </nav>
            </header>
            <main className="flex-1">{children}</main>
            <footer className="bg-gray-800 text-white p-4 text-center">
                © 2024 DiscordLikeApp
            </footer>
        </div>
    );
};

export default Layout;
