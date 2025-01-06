'use client';

import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';
import { Server } from '@/app/types/server';
import Layout from '@/components/Layout/Layout';
import Sidebar from '@/components/Sidebar/Sidebar';
import MainContent from '@/components/MainContent/MainContent';

export default function DashboardPage() {
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

    const handleServerCreated = () => {
        fetchServers();
    };

    if (!user) return <div>Loading...</div>;

    return (
        <Layout>
            <Sidebar servers={servers} onServerCreated={handleServerCreated} />
            <MainContent servers={servers} fetchServers={fetchServers} />
        </Layout>
    );
}
