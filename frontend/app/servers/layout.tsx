'use client';

import React, { useEffect, useState, useCallback, useContext } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar/Sidebar';
import ProfilePopup from '@/components/ProfilePopup';
import api from '@/utils/api';
import { Server } from '@/app/types/server';
import { ServerUpdateContext } from './context/ServerUpdateContext';
import { AuthContext } from '@/context/AuthContext';

export default function ServersLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { user } = useContext(AuthContext);

    // サーバー一覧用のステート
    const [servers, setServers] = useState<Server[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchServers = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get('/servers/my_servers');
            setServers(response.data);
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error('Error fetching servers:', error.message);
            } else {
                console.error('Error fetching servers:', error);
            }
        } finally {
            setLoading(false);
        }
    }, []);

    // ユーザーが存在する場合のみサーバー一覧を取得する
    useEffect(() => {
        if (user) {
            fetchServers();
        }
    }, [user, fetchServers]);

    // ユーザー状態が変わったらリダイレクト処理を実行
    useEffect(() => {
        if (user === null) {
            router.push('/login?redirect=' + window.location.pathname);
        }
    }, [user, router]);

    // ユーザー情報がロード中、または未認証、またはサーバーデータ取得中の場合はローディング表示
    if (user === undefined || user === null || loading) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-gray-900 text-white">
                Loading...
            </div>
        );
    }

    return (
        <ServerUpdateContext.Provider value={fetchServers}>
            <div className="flex h-screen bg-gray-900 text-white">
                {/* サイドバー */}
                <Sidebar servers={servers} onServerCreated={fetchServers} />

                {/* メイン表示部分 */}
                <div className="flex-1 h-full overflow-auto custom-scrollbar">
                    {children}
                </div>

                {/* プロファイルポップアップ */}
                <div className="absolute top-4 right-4">
                    <ProfilePopup />
                </div>
            </div>
        </ServerUpdateContext.Provider>
    );
}
