'use client';

import React, {useState, useRef, useEffect, useContext} from 'react';
import {useRouter} from 'next/navigation';
import {AuthContext} from "@/context/AuthContext";

const ProfilePopup = () => {
    const [isOpen, setIsOpen] = useState(false);
    const popupRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

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

    const {user, logout} = useContext(AuthContext);
    const handleLogout = () => {
        logout();
        router.push('/login');
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
                            onClick={() => router.push('/profile/edit')}
                        >
                            プロフィール編集
                        </li>
                        <li
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => router.push('/account/settings')}
                        >
                            アカウント管理
                        </li>
                        <li
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={handleLogout}>
                            ログアウト
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ProfilePopup;