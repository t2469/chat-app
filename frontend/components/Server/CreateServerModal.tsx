'use client';

import React from 'react';
import CreateServerForm from './CreateServerForm';
import Modal from '../Modal';

interface CreateServerModalProps {
    onClose: () => void;
    onServerCreated: () => void;
}

const CreateServerModal: React.FC<CreateServerModalProps> = ({ onClose, onServerCreated }) => {
    return (
        <Modal isOpen={true} onClose={onClose}>
            <h2 className="text-xl text-white mb-4">サーバーを作成</h2>
            <CreateServerForm onServerCreated={onServerCreated} />
        </Modal>
    );
};

export default CreateServerModal;
