'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Sidebar from '@/components/Sidebar/Sidebar';
import ProfilePopup from '@/components/ProfilePopup';
import api from '@/utils/api';
import { Server } from '@/app/types/server';
import { ServerUpdateContext } from './context/ServerUpdateContext';

export default function ServersLayout({ children }: { children: React.ReactNode }) {
    const [servers, setServers] = useState<Server[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchServers = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get('/servers/my_servers');
            setServers(response.data);
        } catch (error) {
            console.error('Error fetching servers:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchServers();
    }, [fetchServers]);

    const handleServerCreated = () => {
        fetchServers();
    };

    // 参加後などでサーバー一覧を再取得させたい時に呼ぶ関数
    const handleServersRefresh = () => {
        fetchServers();
    };

    if (loading) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-gray-900 text-white">
                Loading...
            </div>
        );
    }

    return (
        // Context でサーバー再取得関数を子コンポーネントに提供
        <ServerUpdateContext.Provider value={handleServersRefresh}>
            <div className="flex h-screen bg-gray-900 text-white">
                {/* サイドバー */}
                <Sidebar servers={servers} onServerCreated={handleServerCreated}/>

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
