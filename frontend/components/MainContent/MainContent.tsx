'use client';

import React, {useContext} from 'react';
import api from "@/utils/api";
import {Server} from '@/app/types/server';
import ProfilePopup from '@/components/ProfilePopup';
import {AuthContext} from '@/context/AuthContext';

type Props = {
    servers: Server[];
    fetchServers: () => void;
};

export default function MainContent({servers, fetchServers}: Props) {
    const {user} = useContext(AuthContext);

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
        <main className="flex-1 flex flex-col p-6 bg-gray-900">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl text-white">こんにちは、{user?.username}さん</h1>
                <ProfilePopup/>
            </div>

            {/* チャットエリア */}
            <div className="flex-1 bg-gray-800 rounded p-4 overflow-y-auto custom-scrollbar">
                {/* 仮のチャットメッセージ */}
                <div className="text-white mb-2">チャットメッセージ1</div>
                <div className="text-white mb-2">チャットメッセージ2</div>
                <div className="text-white mb-2">チャットメッセージ3</div>
            </div>
        </main>
    );
}
