// frontend/app/dashboard/page.tsx

'use client';

import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '../../utils/api';

interface Server {
    id: number;
    name: string;
    icon_url?: string;
    owner_id: number;
    created_at: string;
    updated_at: string;
}

const DashboardPage = () => {
    const { user } = useContext(AuthContext);
    const router = useRouter();

    if (!user) return <div>Loading...</div>;
    return (
        <div className="max-w-4xl mx-auto mt-10 p-4">
            <h1 className="text-3xl mb-4">ようこそ、{user.username}さん！</h1>
            <div className="mb-6">
                <h2 className="text-2xl mb-2">あなたのサーバー</h2>
            </div>
        </div>
    );
};

export default DashboardPage;
