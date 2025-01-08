'use client';

import { useEffect, useState, useRef } from 'react';
import { createConsumer, Cable, Channel } from '@rails/actioncable';

interface Message {
    id: number;
    content: string;
    user_id: number;
    username: string;
    created_at: string;
}

export const useChannelMessages = (channelId: number) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const cableRef = useRef<Cable | null>(null);
    const subscriptionRef = useRef<Channel | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('JWT token not found');
            return;
        }

        const cableUrl = process.env.NEXT_PUBLIC_CABLE_URL || `ws://localhost:3000/cable?token=${token}`;
        cableRef.current = createConsumer(cableUrl);

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

        return () => {
            if (subscriptionRef.current) {
                subscriptionRef.current.unsubscribe();
            }
            if (cableRef.current) {
                cableRef.current.disconnect();
            }
        };
    }, [channelId]);

    const sendMessage = (content: string) => {
        if (subscriptionRef.current) {
            subscriptionRef.current.perform('speak', { content, channel_id: channelId });
        }
    };

    return { messages, sendMessage };
};
