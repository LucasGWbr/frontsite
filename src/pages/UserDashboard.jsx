import React, {useEffect, useState} from 'react';
import '../assets/css/UserDashboard.css';
import ConfirmationModal from "../components/ConfirmationModal.jsx";
import {getEventByUser, patchInscription} from "../Services/APIService.js";


const UserDashboard = () => {
    const [inscricoes, setInscricoes] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedInscricao, setSelectedInscricao] = useState(null);
    const [id, setId] = useState(() => {
        return localStorage.getItem('id') || null;
    });

    useEffect(() => {
        const loadEvent = async () => {
            if(id !== null) {
                const data = await getEventByUser(id);
                setInscricoes(data);
            }
        };

        loadEvent();
    }, [id]);
    const handleCancelClick = (inscricao) => {
        setSelectedInscricao(inscricao);
        setIsModalOpen(true);
    };

    const handleConfirmCancel = () => {
        // Lógica para remover a inscrição da lista (simula o cancelamento)
        const response = patchInscription(selectedInscricao.inscriptionId, { status: 'INACTIVE' });
        setIsModalOpen(false);
        setSelectedInscricao(null);
        window.location.reload();
    };

    const today = new Date();
    const proximosEventos = inscricoes.filter(i => new Date(i.startDate) > today);
    const eventosAnteriores = inscricoes.filter(i => new Date(i.startDate) <= today);

    return (
        <div className="dashboard-container">
            <div className="dashboard-content">
                <h1>Meu Painel</h1>
                <a href={'/'}>CLIQUE</a>
                <section className="events-section">
                    <h2>Próximos Eventos</h2>
                    {proximosEventos.length > 0 ? proximosEventos.map(inscricao => (
                        <div key={inscricao.eventId} className="subscription-card">
                            <div className="card-info">
                                <h3>{inscricao.name}</h3>
                                <p><strong>Data:</strong> {new Date(inscricao.startDate).toLocaleDateString('pt-BR')}</p>
                                <p><strong>Local:</strong> {inscricao.location}</p>
                                <p><strong>Status:</strong> <span className="status-inscrito">Inscrito</span></p>
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
                        <div key={inscricao.eventId} className="subscription-card">
                            <div className="card-info">
                                <h3>{inscricao.name}</h3>
                                <p><strong>Data:</strong> {new Date(inscricao.startDate).toLocaleDateString('pt-BR')}</p>
                                <p><strong>Local:</strong> {inscricao.location}</p>
                                <p><strong>Status:</strong> <span className="status-concluido">Concluído</span></p>
                            </div>
                            <div className="card-actions">
                                    <button className="action-button certificate-button">
                                        Baixar Certificado
                                    </button>
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
                    eventName={selectedInscricao.name}
                />
            )}
        </div>
    );
};

export default UserDashboard;