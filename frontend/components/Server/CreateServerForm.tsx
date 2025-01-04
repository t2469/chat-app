'use client';

import React, {useState} from 'react';
import api from '@/utils/api';
import {Server} from '@/app/types/server';

interface CreateServerFormProps {
    onServerCreated?: (server: Server) => void;
}

const CreateServerForm: React.FC<CreateServerFormProps> = ({onServerCreated}) => {
    const [form, setForm] = useState({
        name: '',
        icon_url: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({...form, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.post('/servers', {server: form});
            alert('サーバーが作成されました。');
            if (onServerCreated) {
                onServerCreated(response.data);
            }
            setForm({name: '', icon_url: ''});
        } catch (error) {
            console.error('Server creation failed:', error);
            alert('サーバーの作成に失敗しました。');
        }
    };

    return (
        <div className="mt-6 p-4 border rounded">
            <h3 className="text-xl mb-2">新しいサーバーを作成</h3>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="サーバー名"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full p-2 mb-2 border rounded text-black"
                />
                <input
                    type="text"
                    name="icon_url"
                    placeholder="アイコンURL（任意）"
                    value={form.icon_url}
                    onChange={handleChange}
                    className="w-full p-2 mb-4 border rounded text-black"
                />
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
                    サーバー作成
                </button>
            </form>
        </div>
    );
};

export default CreateServerForm;