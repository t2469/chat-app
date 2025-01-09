'use client';

import React, { useState, useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const RegisterPage = () => {
    const { signup } = useContext(AuthContext);
    const router = useRouter();

    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
        avatar_url: '',
    });

    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (form.password !== form.password_confirmation) {
            setError('パスワードが一致しません。');
            return;
        }
        try {
            await signup(form.username, form.email, form.password);
            router.push('/servers');
        } catch {
            setError('登録に失敗しました。');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-4 border rounded">
            <h1 className="text-2xl mb-4">ユーザー登録</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="username"
                    placeholder="ユーザー名"
                    value={form.username}
                    onChange={handleChange}
                    required
                    className="w-full p-2 mb-2 border rounded text-black"
                />
                <input
                    type="email"
                    name="email"
                    placeholder="メールアドレス"
                    value={form.email}
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
                    className="w-full p-2 mb-2 border rounded text-black"
                />
                <input
                    type="password"
                    name="password_confirmation"
                    placeholder="パスワード確認"
                    value={form.password_confirmation}
                    onChange={handleChange}
                    required
                    className="w-full p-2 mb-2 border rounded text-black"
                />
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
                    登録
                </button>
            </form>
            {error && <p className="text-red-500 mt-2">{error}</p>} {/* エラーメッセージ表示 */}
            <p className="mt-4">
                すでにアカウントをお持ちですか？{' '}
                <a href="/login" className="text-blue-500 underline">
                    ログイン
                </a>
            </p>
        </div>
    );
};

export default RegisterPage;
