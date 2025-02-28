'use client';

import React, {useContext, useEffect, useState, useRef} from 'react';
import {useParams} from 'next/navigation';
import {AuthContext} from '@/context/AuthContext';
import api from '@/utils/api';
import {useChannelMessages} from '@/hooks/useChannelMessages';
import {format} from 'date-fns';
import {Server} from '@/app/types/server';

export default function ChannelChatPage() {
    const {serverId, channelId} = useParams() as { serverId: string; channelId: string };
    const {user} = useContext(AuthContext);

    const [server, setServer] = useState<Server | null>(null);
    const {messages, sendMessage, loading, error} = useChannelMessages(Number(serverId), Number(channelId));
    const [input, setInput] = useState<string>('');

    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        // サーバー情報の取得
        const fetchServer = async () => {
            try {
                const response = await api.get<Server>(`/servers/${serverId}`);
                setServer(response.data);
            } catch (err) {
                console.error('Error fetching server:', err);
            }
        };

        fetchServer();
    }, [serverId]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        try {
            await sendMessage(input);
            setInput('');
        } catch (err: unknown) {
            console.error('Error sending message:', err);
            alert('メッセージ送信に失敗しました。');
        }
    };

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({behavior: 'smooth'});
        }
    }, [messages]);

    return (
        <main className="flex flex-col p-6 bg-gray-900 min-h-screen w-full text-white">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl">
                    {server ? `# ${server.name}` : 'Loading...'}, こんにちは、{user?.username}さん
                </h1>
            </div>

            {/* メッセージ表示領域 */}
            <div className="flex-1 bg-gray-800 rounded p-4 overflow-y-auto custom-scrollbar mb-4">
                {loading && <p>メッセージを読み込み中...</p>}
                {error && <p className="text-red-500">{error}</p>}
                {!loading && !error && messages.length === 0 && <p>まだメッセージがありません。</p>}

                {messages.map((msg) => {
                    const isOwnMessage = msg.user_id === user?.id;
                    const formattedTime = format(new Date(msg.created_at), 'yyyy/MM/dd HH:mm');

                    return (
                        <div
                            key={msg.id}
                            className={`mb-6 flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className="max-w-2xl px-3">
                                <div className={`text-sm mb-1 ${isOwnMessage ? 'text-right' : 'text-left'}`}>
                                    <span className="font-semibold">{msg.username}</span>
                                    <span className="ml-2 text-xs text-gray-400">{formattedTime}</span>
                                </div>
                                <div
                                    className={`hover:bg-gray-600 transition-colors p-3 rounded-lg break-words w-full ${
                                        isOwnMessage ? 'bg-gray-700 text-white' : 'bg-gray-700 text-white'
                                    }`}
                                >
                                    <p>{msg.content}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* メッセージ送信用フォーム */}
            <form onSubmit={handleSendMessage} className="flex">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="メッセージを入力..."
                    className="flex-1 bg-gray-700 text-white p-3 rounded-l focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                    required
                />
                <button
                    type="submit"
                    className="p-3 bg-green-500 text-white rounded-r hover:bg-green-600 transition flex items-center justify-center"
                    aria-label="メッセージを送信"
                >
                    送信
                </button>
            </form>
        </main>
    );
}
