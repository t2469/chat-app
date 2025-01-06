'use client';

import React from 'react';
import { Server } from '@/app/types/server';

type Props = {
    servers: Server[];
};

export default function Sidebar({ servers }: Props) {
    return (
        <aside className="w-20 bg-gray-800 py-4 flex flex-col items-center space-y-4">
            {servers.map((server) => (
                <button
                    key={server.id}
                    className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center
                     hover:bg-gray-600 transition"
                    onClick={() => alert(`サーバー「${server.name}」をクリックしました`)}
                >
                    {server.name.charAt(0).toUpperCase()}
                </button>
            ))}
        </aside>
    );
}