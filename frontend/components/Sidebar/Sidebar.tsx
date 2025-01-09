'use client';

import React, {useState} from 'react';
import {Server} from '@/app/types/server';
import Link from 'next/link';
import Image from 'next/image';
import {usePathname} from 'next/navigation';
import CreateServerModal from '../Server/CreateServerModal';

type Props = {
    servers: Server[];
    onServerCreated: () => void;
};

export default function Sidebar({servers, onServerCreated}: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const pathname = usePathname();
    const activeServerId = pathname.split('/')[2];

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    return (
        <>
            <aside
                className="h-screen w-20 flex-shrink-0 bg-gray-800 py-4 flex flex-col items-center space-y-4 overflow-y-auto scrollbar-hide">
                {/* サーバーアイコン */}
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

                {/* サーバー作成フォームの "+" ボタン */}
                <button
                    onClick={toggleModal}
                    className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors flex-shrink-0"
                >
                    <span className="text-green-500 text-2xl">+</span>
                </button>

                <Link
                    href="/servers/discovery"
                    className="
                        w-12 h-12 bg-blue-700 rounded-full
                        flex items-center justify-center
                        hover:bg-blue-600 transition-colors flex-shrink-0
                    "
                >
                    <span className="text-blue-400 text-lg">🔍</span>
                </Link>
            </aside>

            {/* サーバー作成モーダル */}
            {isModalOpen && (
                <CreateServerModal onClose={toggleModal} onServerCreated={onServerCreated}/>
            )}
        </>
    );
}
