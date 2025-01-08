'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/utils/api';
import { Server } from '@/app/types/server';

interface Channel {
    id: number;
    name: string;
}

export default function ServerPage() {
    const { serverId } = useParams() as { serverId: string };
    const [server, setServer] = useState<Server | null>(null);
    const [channels, setChannels] = useState<Channel[]>([]);
    const [loading, setLoading] = useState(true);
    const [newChannelName, setNewChannelName] = useState('');

    useEffect(() => {
        const fetchServerData = async () => {
            try {
                // サーバー情報を取得
                const resServer = await api.get(`/servers/${serverId}`);
                setServer(resServer.data);

                // チャンネル一覧を取得
                const resChannels = await api.get(`/servers/${serverId}/channels`);
                setChannels(resChannels.data);
            } catch (error) {
                console.error('Error fetching server or channels:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchServerData();
    }, [serverId]);

    const handleCreateChannel = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newChannelName.trim()) return;

        try {
            const res = await api.post(`/servers/${serverId}/channels`, {
                channel: { name: newChannelName },
            });
            setChannels((prev) => [...prev, res.data]);
            setNewChannelName('');
        } catch (error: any) {
            console.error('Error creating channel:', error);
            alert(error.response?.data?.errors?.join(', ') || 'チャンネル作成に失敗しました。');
        }
    };

    if (loading) {
        return <div className="p-4 text-white">Loading...</div>;
    }

    if (!server) {
        return <div className="p-4 text-white">サーバーが見つかりませんでした。</div>;
    }

    return (
        <div className="p-4 text-white bg-gray-900 min-h-screen">
            <h1 className="text-2xl mb-4">サーバー: {server.name}</h1>

            <h2 className="text-xl mb-2">チャンネル一覧</h2>
            <ul className="space-y-2 mb-4">
                {channels.map((channel) => (
                    <li key={channel.id}>
                        {/* クリックするとチャンネルページへ移動 */}
                        <Link href={`/servers/${serverId}/channels/${channel.id}`}>
                            <span className="cursor-pointer hover:underline">#{channel.name}</span>
                        </Link>
                    </li>
                ))}
            </ul>

            {/* チャンネル作成フォーム */}
            <form onSubmit={handleCreateChannel} className="flex space-x-2">
                <input
                    type="text"
                    value={newChannelName}
                    onChange={(e) => setNewChannelName(e.target.value)}
                    placeholder="新しいチャンネル名"
                    className="flex-1 p-2 rounded bg-gray-700 text-white focus:outline-none"
                    required
                />
                <button type="submit" className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
                    作成
                </button>
            </form>
        </div>
    );
}
