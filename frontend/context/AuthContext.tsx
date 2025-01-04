'use client';

import React, {createContext, useState, useEffect, ReactNode} from 'react';
import api from '../utils/api';

// ユーザーモデル
interface User {
    id: number;
    username: string;
    email: string;
    avatar_url?: string;
    created_at: string;
    updated_at: string;
}

// 状態を null/undefined/オブジェクトで管理する
//   undefined = ロード中
//   null      = ログインしていない（トークン無効など）
//   User      = ログイン済み
interface AuthContextType {
    user: User | null | undefined;
    login: (email: string, password: string) => Promise<void>;
    signup: (username: string, email: string, password: string) => Promise<void>;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
    user: undefined, // 初期はロード中（undefined）とする
    login: async () => {
    },
    signup: async () => {
    },
    logout: () => {
    },
});

export const AuthProvider = ({children}: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null | undefined>(undefined);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('/user');
                setUser(response.data);
            } catch (error) {
                setUser(null);
            }
        };

        const token = localStorage.getItem('token');
        if (token) {
            fetchProfile();
        } else {
            setUser(null);
        }
    }, []);

    const login = async (email: string, password: string) => {
        const response = await api.post('/login', {email, password});
        localStorage.setItem('token', response.data.token);
        setUser(response.data.user);
    };

    const signup = async (username: string, email: string, password: string) => {
        const response = await api.post('/signup', {
            user: {
                username,
                email,
                password,
                password_confirmation: password
            },
        });
        localStorage.setItem('token', response.data.token);
        setUser(response.data.user);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{user, login, signup, logout}}>
            {children}
        </AuthContext.Provider>
    );
};