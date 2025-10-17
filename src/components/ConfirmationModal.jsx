import React from 'react';
import '../assets/css/ConfirmationModal.css';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, eventName }) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <h2>Confirmar Cancelamento</h2>
                <p>Você tem certeza que deseja cancelar sua inscrição para o evento <strong>"{eventName}"</strong>?</p>
                <p>Esta ação não pode ser desfeita.</p>
                <div className="modal-actions">
                    <button onClick={onClose} className="modal-button secondary">Voltar</button>
                    <button onClick={onConfirm} className="modal-button danger">Confirmar Cancelamento</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;