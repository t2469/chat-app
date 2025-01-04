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
        if (user === undefined)return;

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

    if (!user) return <div>Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto mt-10 p-4">
            <h1 className="text-3xl mb-4">ようこそ、{user.username}さん！</h1>

            {/* サーバー一覧 */}
            <div className="mb-6">
                <h2 className="text-2xl mb-2">あなたのサーバー</h2>
                <ul>
                    {servers.map((server) => (
                        <li key={server.id} className="mb-2">
              <span className="text-white">
                {server.name}
              </span>
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