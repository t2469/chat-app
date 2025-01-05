'use client';

import React, { useEffect, useState } from 'react';
import { Server } from '@/app/types/server';
import Image from 'next/image';
import Link from 'next/link';
// import CreateServerModal from '@/components/CreateServerModal';
import { usePathname } from 'next/navigation';
import api from '@/utils/api';

const ServerList = () => {
    const [servers, setServers] = useState<Server[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    // const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const pathname = usePathname();
    const activeServerId = pathname.split('/')[2];

    useEffect(() => {
        const fetchServers = async () => {
            setLoading(true);
            try {
                const response = await api.get('/servers/my_servers');
                setServers(response.data);
            } catch (err: any) {
                setError(err.response?.data?.error || 'サーバーの取得に失敗しました。');
            } finally {
                setLoading(false);
            }
        };

        fetchServers();
    }, []);

    const handleServerCreated = (newServer: Server) => {
        setServers((prev) => [...prev, newServer]);
    };

    if (loading) {
        return (
            <div className="w-20 bg-gray-800 p-2 flex flex-col items-center">
                <div className="w-12 h-12 bg-gray-700 rounded-full animate-pulse"></div>
                <p className="text-gray-400 text-xs mt-2">読み込み中...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-20 bg-gray-800 p-2 flex flex-col items-center">
                <p className="text-red-500 text-xs">{error}</p>
            </div>
        );
    }

    return (
        <div className="w-20 bg-gray-800 p-2 flex flex-col items-center space-y-4 overflow-y-auto">
            {servers.map((server) => (
                <Link href={`/servers/${server.id}`} key={server.id}>
                    <div
                        className={`w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-600 transition-colors ${
                            server.id.toString() === activeServerId ? 'border-2 border-blue-500' : ''
                        }`}
                    >
                        {server.icon_url ? (
                            <Image
                                src={server.icon_url}
                                alt={server.name}
                                width={24}
                                height={24}
                                className="rounded-full"
                            />
                        ) : (
                            <span className="text-white text-sm font-bold">
                                {server.name.charAt(0).toUpperCase()}
                            </span>
                        )}
                    </div>
                </Link>
            ))}
            {/* サーバー追加ボタンを一時的に無効化 */}
            {/*
            <button
                onClick={() => setIsModalOpen(true)}
                className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors"
            >
                <span className="text-white text-xl font-bold">+</span>
            </button>
            */}
            {/* サーバー追加モーダルを一時的に無効化 */}
            {/*
            <CreateServerModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onServerCreated={handleServerCreated}
            />
            */}
        </div>
    );
};

export default ServerList;