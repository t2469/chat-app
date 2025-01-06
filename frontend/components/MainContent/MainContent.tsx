'use client';

import React from 'react';
import { Server } from '@/app/types/server';
import ProfilePopup from '@/components/ProfilePopup';
import CreateServerForm from '@/components/Server/CreateServerForm';
import api from "@/utils/api";

type Props = {
    servers: Server[];
    fetchServers: () => void;
};

export default function MainContent({ servers, fetchServers }: Props) {
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

    return (
        <main className="flex-1 p-6 overflow-auto">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl">ようこそ！</h1>
                <ProfilePopup />
            </div>

            <div className="mb-6">
                <h2 className="text-xl mb-2">サーバー一覧</h2>
                <ul>
                    {servers.map((server) => (
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

            <CreateServerForm onServerCreated={() => fetchServers()} />
        </main>
    );
}