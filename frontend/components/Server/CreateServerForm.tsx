'use client';

import React, {useState} from 'react';
import api from '@/utils/api';

interface CreateServerFormProps {
    onServerCreated: () => void;
}

const CreateServerForm: React.FC<CreateServerFormProps> = ({onServerCreated}) => {
    const [form, setForm] = useState({
        name: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({...form, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/servers', {server: form});
            alert('サーバーが作成されました。');
            onServerCreated();
            setForm({name: ''});
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error('Server creation failed:', error);
                alert('サーバーの作成に失敗しました。');
            }
            if (typeof error === 'object' && error !== null && 'response' in error) {
                const err = error as { response?: { data?: { errors?: string[] } } };
                alert(err.response?.data?.errors?.[0] || 'サーバーの作成に失敗しました。');
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                name="name"
                placeholder="サーバー名"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full p-2 mb-2 rounded text-black"
            />
            <button type="submit" className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 transition">
                作成
            </button>
        </form>
    );
};

export default CreateServerForm;
