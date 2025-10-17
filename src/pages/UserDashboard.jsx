import React, { useState } from 'react';
import '../assets/css/UserDashboard.css';
import ConfirmationModal from "../components/ConfirmationModal.jsx";

// --- DADOS MOCADOS ---
// Em uma aplicação real, isso viria de uma API após o login do usuário.
const mockInscricoes = [
    {
        id: 1,
        eventName: 'Conferência de Tecnologia 2025',
        eventDate: '2025-11-20T10:00:00Z',
        location: 'Centro de Convenções, São Paulo',
        status: 'Inscrito',
        hasPresence: false,
    },
    {
        id: 2,
        eventName: 'Workshop de Design UX/UI',
        eventDate: '2025-12-05T14:00:00Z',
        location: 'Online',
        status: 'Inscrito',
        hasPresence: false,
    },
    {
        id: 3,
        eventName: 'Festival de Música Indie',
        eventDate: '2025-01-15T18:00:00Z', // Data passada
        location: 'Parque Ibirapuera, São Paulo',
        status: 'Concluído',
        hasPresence: true, // Presença confirmada, pode emitir certificado
    },
    {
        id: 4,
        eventName: 'Maratona de Programação',
        eventDate: '2024-09-10T09:00:00Z', // Data passada
        location: 'Online',
        status: 'Concluído',
        hasPresence: false, // Não compareceu, não pode emitir certificado
    },
];

const UserDashboard = () => {
    const [inscricoes, setInscricoes] = useState(mockInscricoes);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedInscricao, setSelectedInscricao] = useState(null);

    const handleCancelClick = (inscricao) => {
        setSelectedInscricao(inscricao);
        setIsModalOpen(true);
    };

    const handleConfirmCancel = () => {
        // Lógica para remover a inscrição da lista (simula o cancelamento)
        setInscricoes(inscricoes.filter(item => item.id !== selectedInscricao.id));
        setIsModalOpen(false);
        setSelectedInscricao(null);
        // Em uma app real, aqui você faria uma chamada de API para cancelar.
    };

    const today = new Date();
    const proximosEventos = inscricoes.filter(i => new Date(i.eventDate) > today);
    const eventosAnteriores = inscricoes.filter(i => new Date(i.eventDate) <= today);

    return (
        <div className="dashboard-container">
            <div className="dashboard-content">
                <h1>Meu Painel</h1>
                <a href={'/'}>CLIQUE</a>
                <section className="events-section">
                    <h2>Próximos Eventos</h2>
                    {proximosEventos.length > 0 ? proximosEventos.map(inscricao => (
                        <div key={inscricao.id} className="subscription-card">
                            <div className="card-info">
                                <h3>{inscricao.eventName}</h3>
                                <p><strong>Data:</strong> {new Date(inscricao.eventDate).toLocaleDateString('pt-BR')}</p>
                                <p><strong>Local:</strong> {inscricao.location}</p>
                                <p><strong>Status:</strong> <span className="status-inscrito">{inscricao.status}</span></p>
                            </div>
                            <div className="card-actions">
                                <button
                                    className="action-button cancel-button"
                                    onClick={() => handleCancelClick(inscricao)}
                                >
                                    Cancelar Inscrição
                                </button>
                            </div>
                        </div>
                    )) : <p>Você não está inscrito em nenhum evento futuro.</p>}
                </section>

                <section className="events-section">
                    <h2>Eventos Anteriores</h2>
                    {eventosAnteriores.length > 0 ? eventosAnteriores.map(inscricao => (
                        <div key={inscricao.id} className="subscription-card">
                            <div className="card-info">
                                <h3>{inscricao.eventName}</h3>
                                <p><strong>Data:</strong> {new Date(inscricao.eventDate).toLocaleDateString('pt-BR')}</p>
                                <p><strong>Local:</strong> {inscricao.location}</p>
                                <p><strong>Status:</strong> <span className="status-concluido">{inscricao.status}</span></p>
                            </div>
                            <div className="card-actions">
                                {inscricao.hasPresence ? (
                                    <button className="action-button certificate-button">
                                        Baixar Certificado
                                    </button>
                                ) : (
                                    <p className="no-certificate">Certificado indisponível</p>
                                )}
                            </div>
                        </div>
                    )) : <p>Você não participou de nenhum evento ainda.</p>}
                </section>
            </div>

            {selectedInscricao && (
                <ConfirmationModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onConfirm={handleConfirmCancel}
                    eventName={selectedInscricao.eventName}
                />
            )}
        </div>
    );
};

export default UserDashboard;