'use client';

import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';
import CreateServerForm from '@/components/Server/CreateServerForm';
import { Server } from '@/app/types/server';
import ProfilePopup from '@/components/ProfilePopup';

const DashboardPage = () => {
    const { user } = useContext(AuthContext);
    const [servers, setServers] = useState<Server[]>([]);
    const router = useRouter();

    useEffect(() => {
        if (user === undefined) return;
        if (user === null) {
            router.push('/login');
            return;
        }
        fetchServers();
    }, [user]);

    const fetchServers = async () => {
        try {
            const response = await api.get('/servers/my_servers');
            setServers(response.data);
        } catch (error) {
            console.error('Error fetching servers:', error);
        }
    };

    const handleServerCreated = (newServer: Server) => {
        setServers(prev => [...prev, newServer]);
    };

    const handleJoin = async (serverId: string) => {
        try {
            const response = await api.post(`/servers/${serverId}/join`);
            alert(response.data.message);
            fetchServers();
        } catch (error: any) {
            console.error('Error joining server:', error);
            alert(error.response?.data?.errors?.[0] || 'サーバーへの参加に失敗しました。');
        }
    };

    const handleLeave = async (serverId: string) => {
        try {
            const response = await api.delete(`/servers/${serverId}/leave`);
            alert(response.data.message);
            fetchServers();
        } catch (error: any) {
            console.error('Error leaving server:', error);
            alert(error.response?.data?.errors?.[0] || 'サーバーからの脱退に失敗しました。');
        }
    };

    if (!user) return <div>Loading...</div>;

    return (
        <div className="flex h-screen bg-gray-900 text-white">
            {/* サイドバー */}
            <aside className="w-20 bg-gray-800 py-4 flex flex-col items-center space-y-4">
                {servers.map(server => (
                    <button
                        key={server.id}
                        className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center
                       hover:bg-gray-600 transition"
                        onClick={() => alert(`サーバー ${server.name} をクリックしました`)}
                    >
                        {server.name.charAt(0).toUpperCase()}
                    </button>
                ))}
            </aside>

            {/* メインコンテンツ */}
            <main className="flex-1 p-6 overflow-auto">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl">ようこそ、{user.username}さん</h1>
                    <ProfilePopup />
                </div>

                <div className="mb-6">
                    <h2 className="text-xl mb-2">サーバー一覧</h2>
                    <ul>
                        {servers.map(server => (
                            <li key={server.id} className="mb-2 flex items-center justify-between">
                                <span>{server.name}</span>
                                {server.is_member ? (
                                    <button
                                        onClick={() => handleLeave(server.id)}
                                        className="bg-red-500 px-2 py-1 rounded hover:bg-red-600 transition"
                                    >
                                        脱退
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleJoin(server.id)}
                                        className="bg-green-500 px-2 py-1 rounded hover:bg-green-600 transition"
                                    >
                                        参加
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>

                <CreateServerForm onServerCreated={handleServerCreated} />
            </main>
        </div>
    );
};

export default DashboardPage;