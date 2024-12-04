// frontend/app/dashboard/page.tsx

'use client';

import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
// import CreateServerForm from '../../components/Server/CreateServerForm';
import api from '../../utils/api';

interface Server {
    id: number;
    name: string;
    icon_url?: string;
    owner_id: number;
    created_at: string;
    updated_at: string;
}

const DashboardPage = () => {
    const { user } = useContext(AuthContext);
    const router = useRouter();
    const [servers, setServers] = useState<Server[]>([]);

    useEffect(() => {
        const fetchServers = async () => {
            try {
                const response = await api.get('/servers');
                setServers(response.data);
            } catch (error) {
                console.error('Error fetching servers:', error);
                router.push('/login');
            }
        };

        if (user) {
            fetchServers();
        }
    }, [user, router]);

    if (!user) return <div>Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto mt-10 p-4">
            <h1 className="text-3xl mb-4">ようこそ、{user.username}さん！</h1>
            <div className="mb-6">
                <h2 className="text-2xl mb-2">あなたのサーバー</h2>
                <ul>
                    {servers.map((server) => (
                        <li key={server.id} className="mb-2">
                            <Link href={`/server/${server.id}`}>
                                <a className="text-blue-500 underline">{server.name}</a>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
            {/*<CreateServerForm onServerCreated={(newServer: Server) => setServers([...servers, newServer])} />*/}
        </div>
    );
};

export default DashboardPage;
