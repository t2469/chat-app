'use client';

import React, {useContext, useEffect, useRef, useState} from 'react';
import {useRouter} from 'next/navigation';
import {AuthContext} from "@/context/AuthContext";
import api from '@/utils/api';

const ProfilePopup = () => {
    const [isOpen, setIsOpen] = useState(false);
    const popupRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const {logout} = useContext(AuthContext);

    const togglePopup = () => {
        setIsOpen(!isOpen);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleLogout = () => {
        logout();
        router.push('/login');
    };
    const handleUserDestroy = async () => {
        const confirmed = window.confirm("本当にアカウントを削除してよろしいですか？")
        if (!confirmed) return;
        try {
            const response = await api.delete("/user");
            if (response.status === 204 || response.status === 200) {
                logout();
                router.push("login");
            } else {
                alert("アカウントの削除に失敗しました。")
            }
        } catch (error) {
            alert("エラーが発生しました。再度お試しください。")
        }
    };

    return (
        <div className="relative inline-block">
            <button
                onClick={togglePopup}
                className="bg-gray-800 text-white px-4 py-2 rounded-md"
            >
                プロフィール
            </button>
            {isOpen && (
                <div
                    ref={popupRef}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50"
                >
                    <ul className="text-sm text-gray-700">
                        <li
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={handleLogout}
                        >
                            ログアウト
                        </li>

                        <li
                            className="px-4 py-2 text-red-500 hover:bg-gray-100 cursor-pointer"
                            onClick={handleUserDestroy}
                        >
                            アカウント削除
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ProfilePopup;