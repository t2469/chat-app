'use client';

import React, { useState, useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
    const { login } = useContext(AuthContext);
    const router = useRouter();

    const [form, setForm] = useState({
        username: '',
        password: '',
    });

    const [error] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(form.username, form.password);
            router.push('/servers');
        } catch {
            alert('ログインに失敗しました。');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-4 border rounded">
            <h1 className="text-2xl mb-4">ログイン</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="username"
                    name="username"
                    placeholder="ユーザー名"
                    value={form.username}
                    onChange={handleChange}
                    required
                    className="w-full p-2 mb-2 border rounded text-black"
                />
                <input
                    type="password"
                    name="password"
                    placeholder="パスワード"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="w-full p-2 mb-4 border rounded text-black"
                />
                <button type="submit" className="w-full bg-green-500 text-white p-2 rounded">
                    ログイン
                </button>
            </form>
            {error && <p className="text-red-500 mt-2">{error}</p>} {/* エラーメッセージ表示 */}
            <p className="mt-4">
                アカウントをお持ちでないですか？{' '}
                <a href="/register" className="text-blue-500 underline">
                    登録
                </a>
            </p>
        </div>
    );
};

export default LoginPage;
