// app/servers/[serverId]/channels/[channelId]/page.tsx
'use client';

import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'next/navigation';
import { AuthContext } from '@/context/AuthContext';
import api from '@/utils/api';
import ProfilePopup from '@/components/ProfilePopup';
import { useChannelMessages } from '@/hooks/useChannelMessages';

interface Message {
    id: number;
    content: string;
    user_id: number;
    username: string;
    created_at: string;
}

export default function ChannelChatPage() {
    const { serverId, channelId } = useParams() as { serverId: string; channelId: string };
    const { user } = useContext(AuthContext);

    const [server, setServer] = useState<any>(null); // Server型に適宜変更
    const { messages, sendMessage } = useChannelMessages(Number(channelId));
    const [input, setInput] = useState<string>('');

    useEffect(() => {
        // サーバー情報の取得
        const fetchServer = async () => {
            try {
                const res = await api.get(`/servers/${serverId}`);
                setServer(res.data);
            } catch (error) {
                console.error('Error fetching server:', error);
            }
        };

        // チャンネル情報の取得（必要に応じて）
        const fetchChannel = async () => {
            try {
                const res = await api.get(`/servers/${serverId}/channels/${channelId}`);
                // チャンネル情報が必要ならセット
            } catch (error) {
                console.error('Error fetching channel:', error);
            }
        };

        fetchServer();
        fetchChannel();
    }, [serverId, channelId]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        try {
            // メッセージの送信
            await sendMessage(input);
            setInput('');
        } catch (error: any) {
            console.error('Error sending message:', error);
            alert(error.response?.data?.errors?.join(', ') || 'メッセージ送信に失敗しました。');
        }
    };

    return (
        <main className="flex flex-col p-6 bg-gray-900 min-h-screen w-full text-white">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl">
                    {server ? `# ${server.name}` : 'Loading...'}, こんにちは、{user?.username}さん
                </h1>
                <ProfilePopup />
            </div>

            {/* メッセージ表示領域 */}
            <div className="flex-1 bg-gray-800 rounded p-4 overflow-y-auto custom-scrollbar mb-4">
                {messages.map((msg) => (
                    <div key={msg.id} className="text-white mb-2">
                        <strong>{msg.username}: </strong>{msg.content}
                    </div>
                ))}
            </div>

            {/* メッセージ送信用フォーム */}
            <form onSubmit={handleSendMessage} className="flex">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="メッセージを入力..."
                    className="flex-1 bg-gray-700 text-white p-2 rounded-l focus:outline-none"
                    required
                />
                <button type="submit" className="p-2 bg-green-500 text-white rounded-r hover:bg-green-600 transition">
                    送信
                </button>
            </form>
        </main>
    );
}
