'use client';

import React, { useContext, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/utils/api';
import { Server } from '@/app/types/server';
import { ServerUpdateContext } from '../context/ServerUpdateContext';
import { leaveServer } from '@/app/services/serverRequests';
import { AxiosError } from 'axios';

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

    const router = useRouter();
    const refreshSidebarServers = useContext(ServerUpdateContext);

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

    const handleLeaveServer = async () => {
        if (!server) return;

        const confirmLeave = window.confirm(
            `本当にサーバー「${server.name}」を脱退しますか？`
        );
        if (!confirmLeave) return;

        try {
            await leaveServer(serverId);
            alert(`サーバー「${server.name}」を脱退しました。`);
            router.push('/servers'); // 一覧へ移動
            refreshSidebarServers(); // サイドバーの再取得
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                console.error('サーバー脱退エラー:', error);
                alert(
                    error.response?.data?.errors?.join(', ') ||
                    'サーバー脱退に失敗しました。'
                );
            }
        }
    };

    const handleCreateChannel = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newChannelName.trim()) return;
        if (!server) return;

        try {
            const res = await api.post(`/servers/${serverId}/channels`, {
                channel: { name: newChannelName },
            });
            setChannels((prev) => [...prev, res.data]);
            setNewChannelName('');
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                console.error('Error creating channel:', error);
                alert(
                    error.response?.data?.errors?.join(', ') ||
                    'チャンネル作成に失敗しました。'
                );
            }
        }
    };


    if (loading) {
        return <div className="p-4 text-white">Loading...</div>;
    }

    if (!server) {
        return <div className="p-4 text-white">サーバーが見つかりませんでした。</div>;
    }

    if (!server.is_member) {
        return (
            <div className="p-4 text-white">
                あなたはこのサーバーに参加していません。
                <p className="mt-2">サーバーの情報は表示されません。</p>
                <button
                    className="mt-4 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded"
                    onClick={() => router.push('/servers/discovery')}
                >
                    サーバーを探す
                </button>
            </div>
        );
    }

    return (
        <div className="p-4 text-white bg-gray-900 min-h-screen">
            <div className="flex items-center mb-4">
                <h1 className="text-2xl mr-4">サーバー: {server.name}</h1>
                <button
                    onClick={handleLeaveServer}
                    className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded"
                >
                    脱退
                </button>
            </div>

            <h2 className="text-xl mb-2">チャンネル一覧</h2>
            <ul className="space-y-2 mb-4">
                {channels.map((channel) => (
                    <li key={channel.id}>
                        <Link href={`/servers/${serverId}/channels/${channel.id}`}>
                            <span className="cursor-pointer hover:underline">#{channel.name}</span>
                        </Link>
                    </li>
                ))}
            </ul>

            <form onSubmit={handleCreateChannel} className="flex space-x-2">
                <input
                    type="text"
                    value={newChannelName}
                    onChange={(e) => setNewChannelName(e.target.value)}
                    placeholder="新しいチャンネル名"
                    className="flex-1 p-2 rounded bg-gray-700 text-white focus:outline-none"
                    required
                />
                <button
                    type="submit"
                    className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                    作成
                </button>
            </form>
        </div>
    );
}
