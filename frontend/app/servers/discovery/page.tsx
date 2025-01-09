'use client';

import React, { useEffect, useState, useContext } from 'react';
import api from '@/utils/api';
import { Server } from '@/app/types/server';
import { ServerUpdateContext } from '../context/ServerUpdateContext';

export default function ServerDiscoveryPage() {
    const [allServers, setAllServers] = useState<Server[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Context からサーバー再取得関数を取得
    const refreshSidebarServers = useContext(ServerUpdateContext);

    useEffect(() => {
        const fetchAllServers = async () => {
            try {
                const response = await api.get('/servers');
                setAllServers(response.data);
            } catch (err) {
                console.error('サーバー一覧取得エラー:', err);
                setError('サーバー一覧の取得に失敗しました');
            } finally {
                setLoading(false);
            }
        };
        fetchAllServers();
    }, []);

    if (loading) {
        return <div className="p-4 text-white">Loading...</div>;
    }

    if (error) {
        return <div className="p-4 text-red-400">{error}</div>;
    }

    return (
        <div className="p-4 text-white h-full">
            <h1 className="text-xl font-bold mb-4">サーバー一覧</h1>
            <ul className="space-y-2">
                {allServers
                    .filter((server) => !server.is_member)
                    .map((server) => (
                        <li
                            key={server.id}
                            className="
                                p-2 bg-gray-800 rounded
                                hover:bg-gray-700 transition-colors
                                flex items-center
                            "
                        >
                            {/* サーバー名（横スクロール） */}
                            <div
                                className="
                                    flex-1 mr-4
                                    overflow-x-auto
                                    whitespace-nowrap
                                    scrollbar-hide
                                    min-w-0
                                "
                            >
                                <h2 className="text-lg font-semibold">
                                    {server.name}
                                </h2>
                                <p className="text-sm text-gray-400">
                                    ID: {server.id}
                                </p>
                            </div>

                            {/* 参加ボタン */}
                            <button
                                className="
                                    bg-blue-600 hover:bg-blue-500
                                    text-white px-3 py-1
                                    rounded flex-shrink-0
                                "
                                onClick={async () => {
                                    try {
                                        await api.post(`/servers/${server.id}/join`);
                                        alert(`${server.name} に参加しました`);

                                        // ローカルリストから削除して、画面から消す
                                        setAllServers((prev) =>
                                            prev.filter((s) => s.id !== server.id)
                                        );

                                        // サイドバーのサーバー一覧を再取得
                                        refreshSidebarServers();
                                    } catch (error) {
                                        console.error('サーバー参加エラー:', error);
                                        alert('サーバー参加に失敗しました');
                                    }
                                }}
                            >
                                参加
                            </button>
                        </li>
                    ))}
            </ul>
        </div>
    );
}
