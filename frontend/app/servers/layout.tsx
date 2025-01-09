'use client';

import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar/Sidebar';
import api from '@/utils/api';
import { Server } from '@/app/types/server';

export default function ServersLayout({ children }: { children: React.ReactNode }) {
    const [servers, setServers] = useState<Server[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchServers = async () => {
            try {
                const response = await api.get('/servers/my_servers');
                setServers(response.data);
            } catch (error) {
                console.error('Error fetching servers:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchServers();
    }, []);

    const handleServerCreated = () => {
        // 新しいサーバーを作成したら再取得
        setLoading(true);
        api
            .get('/servers/my_servers')
            .then((res) => setServers(res.data))
            .catch((err) => console.error('Error re-fetching servers:', err))
            .finally(() => setLoading(false));
    };

    if (loading) {
        return <div className="h-screen w-screen flex items-center justify-center bg-gray-900 text-white">Loading...</div>;
    }

    return (
        <div className="flex h-screen bg-gray-900 text-white">
            {/* サイドバー */}
            <Sidebar servers={servers} onServerCreated={handleServerCreated}/>
            { /* メイン表示部分 */}
            <div className="flex-1 h-full overflow-auto custom-scrollbar">
                {children}
            </div>
        </div>
    );
}
