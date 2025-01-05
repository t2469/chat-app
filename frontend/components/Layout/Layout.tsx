'use client';

import React from 'react';
import ServerList from '@/components/ServerList';
import '@/app/globals.css'

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex h-screen">
            {/* サーバーを左側に配置 */}
            <ServerList />

            {/* メインコンテンツを右側に配置 */}
            <div className="flex-1 bg-gray-100 p-4 overflow-auto">
                {children}
            </div>
        </div>
    );
};

export default Layout;
