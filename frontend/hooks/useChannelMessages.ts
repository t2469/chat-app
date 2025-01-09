'use client';

import { useState, useEffect, useRef } from 'react';
import { createConsumer, Cable, Channel } from '@rails/actioncable';
import api from '@/utils/api';

interface Message {
    id: number;
    content: string;
    user_id: number;
    username: string;
    created_at: string;
}

export const useChannelMessages = (serverId: number, channelId: number) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const cableRef = useRef<Cable | null>(null);
    const subscriptionRef = useRef<Channel | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('JWT token not found');
            setError('認証トークンが見つかりません。');
            setLoading(false);
            return;
        }

        const cableUrl = process.env.NEXT_PUBLIC_CABLE_URL || `ws://localhost:3000/cable?token=${token}`;
        cableRef.current = createConsumer(cableUrl);

        // WebSocket サブスクリプションの作成
        subscriptionRef.current = cableRef.current.subscriptions.create(
            { channel: 'ChannelMessagesChannel', channel_id: channelId },
            {
                connected: () => {
                    console.log(`Connected to ChannelMessagesChannel for channel ${channelId}`);
                },
                disconnected: () => {
                    console.log(`Disconnected from ChannelMessagesChannel for channel ${channelId}`);
                },
                received: (data: Message) => {
                    setMessages((prev) => [...prev, data]);
                },
                speak: (data: { content: string }) => {
                    subscriptionRef.current?.perform('speak', data);
                },
            }
        );

        // 既存のメッセージを取得
        const fetchMessages = async () => {
            try {
                const res = await api.get(`/servers/${serverId}/channels/${channelId}/messages`);
                setMessages(res.data);
                setLoading(false);
            } catch (error: any) {
                console.error('Error fetching messages:', error);
                setError('メッセージの取得に失敗しました。');
                setLoading(false);
            }
        };

        fetchMessages();

        return () => {
            if (subscriptionRef.current) {
                subscriptionRef.current.unsubscribe();
            }
            if (cableRef.current) {
                cableRef.current.disconnect();
            }
        };
    }, [serverId, channelId]);

    const sendMessage = (content: string) => {
        if (subscriptionRef.current) {
            subscriptionRef.current.perform('speak', { content, channel_id: channelId });
        }
    };

    return { messages, sendMessage, loading, error };
};
