'use client';

import React, {useContext, useEffect, useState} from 'react';
import {AuthContext} from '@/context/AuthContext';
import {useRouter} from 'next/navigation';
import api from '@/utils/api';
import CreateServerForm from '@/components/Server/CreateServerForm';
import {Server} from '@/app/types/server';

const DashboardPage = () => {
    const {user} = useContext(AuthContext);
    const [servers, setServers] = useState<Server[]>([]);
    const router = useRouter();

    useEffect(() => {
        // まだロード中なので、何もしない。
        if (user === undefined) return;

        // ログインしていない状態なので、/loginへ遷移させる
        if (user === null) {
            router.push('/login');
            return;
        }

        fetchServers();
    }, [user]);

    const fetchServers = async () => {
        try {
            const response = await api.get('/servers');
            setServers(response.data);
        } catch (error) {
            console.error('Error fetching servers:', error);
        }
    };

    const handleServerCreated = (newServer: Server) => {
        setServers((prev) => [...prev, newServer]);
    };

    const handleJoin = async (serverId: string) => {
        try {
            const response = await api.post(`/servers/${serverId}/join`);
            alert(response.data.message);
            fetchServers(); // サーバー一覧を再取得
        } catch (error: any) {
            console.error('Error joining server:', error);
            alert(error.response?.data?.errors?.[0] || 'サーバーへの参加に失敗しました。');
        }
    };

    const handleLeave = async (serverId: string) => {
        try {
            const response = await api.delete(`/servers/${serverId}/leave`);
            alert(response.data.message);
            fetchServers(); // サーバー一覧を再取得
        } catch (error: any) {
            console.error('Error leaving server:', error);
            alert(error.response?.data?.errors?.[0] || 'サーバーからの脱退に失敗しました。');
        }
    };

    if (!user) return <div>Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto mt-10 p-4">
            <h1 className="text-3xl mb-4">ようこそ、{user.username}さん！</h1>

            {/* サーバー一覧 */}
            <div className="mb-6">
                <h2 className="text-2xl mb-2">あなたのサーバー</h2>
                <ul>
                    {servers.map((server) => (
                        <li key={server.id} className="mb-2 flex items-center justify-between">
                            <span className="text-white">{server.name}</span>
                            {/* サーバーに参加しているかどうかの判定 */}
                            {server.is_member ? (
                                <button
                                    onClick={() => handleLeave(server.id)}
                                    className="bg-red-500 text-white px-2 py-1 rounded"
                                >
                                    脱退
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleJoin(server.id)}
                                    className="bg-green-500 text-white px-2 py-1 rounded"
                                >
                                    参加
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            </div>

            {/* サーバー作成フォーム */}
            <CreateServerForm onServerCreated={handleServerCreated}/>
        </div>
    );
};

export default DashboardPage;