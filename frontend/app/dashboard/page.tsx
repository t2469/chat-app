'use client';

import React, {useContext, useEffect, useState} from 'react';
import {AuthContext} from '@/context/AuthContext';
import {useRouter} from 'next/navigation';
import api from '@/utils/api';
import CreateServerForm from '@/components/Server/CreateServerForm';
// import { Server } from '@/types';

const DashboardPage = () => {
    const {user} = useContext(AuthContext);
    const [servers, setServers] = useState<any[]>([]);
    const router = useRouter();

    useEffect(() => {
        if (!user) {
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

    const handleServerCreated = (newServer: any) => {
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
              <span className="text-blue-500">
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