'use client';

import React from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={handleBackgroundClick}
        >
            <div className="bg-gray-800 p-6 rounded-lg w-80">
                <button onClick={onClose} className="text-white text-2xl absolute top-4 right-4">
                    &times;
                </button>
                {children}
            </div>
        </div>
    );
};

export default Modal;
