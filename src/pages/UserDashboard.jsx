import React, {useEffect, useState} from 'react';
import '../assets/css/UserDashboard.css';
import ConfirmationModal from "../components/ConfirmationModal.jsx";
import {getEventByUser, getPresence, patchInscription} from "../Services/APIService.js";

const UserDashboard = () => {
    // Estados para as listas filtradas
    const [proximosEventos, setProximosEventos] = useState([]);
    const [eventosAnteriores, setEventosAnteriores] = useState([]);

    // Estados de controle do modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedInscricao, setSelectedInscricao] = useState(null);

    // Estado para o ID do usuário
    const [id, setId] = useState(() => {
        return localStorage.getItem('id') || null;
    });

    // Efeito para carregar e filtrar os dados na inicialização
    useEffect(() => {
        const loadAndFilterEvents = async () => {
            if (id !== null) {
                try {

                    const allInscricoes = await getEventByUser(id);
                    const allPresences = await getPresence(id);
                    console.log(allPresences);
                    console.log("aqui");


                    // --- DEBUG ---
                    // Abra o console (F12) no navegador para ver os dados que chegam da API.
                    console.log("Inscrições recebidas (allInscricoes):", allInscricoes);
                    console.log("Presenças recebidas (allPresences):", allPresences);
                    // --- FIM DO DEBUG ---

                    // 2. Crie um Set (para performance) com os IDs dos eventos que TÊM presença
                    //    AJUSTE AQUI se o nome da propriedade for diferente de 'event_id'
                    const presenceEventIds = new Set(allPresences.map(p => p.event_id));

                    // 3. Filtre a lista de inscrições com base no Set
                    //    AJUSTE AQUI se o nome da propriedade for diferente de 'idEvent'
                    const anteriores = allInscricoes.filter(i => presenceEventIds.has(i.idEvent));
                    const proximos = allInscricoes.filter(i => !presenceEventIds.has(i.idEvent));

                    // 4. Atualize os estados para re-renderizar o componente
                    setEventosAnteriores(anteriores);
                    setProximosEventos(proximos);

                } catch (error) {
                    console.error("Erro ao carregar dados do painel:", error);
                }
            }
        };

        loadAndFilterEvents();
    }, [id]); // Dependência: executa novamente se o 'id' mudar

    // Abre o modal de confirmação
    const handleCancelClick = (inscricao) => {
        setSelectedInscricao(inscricao);
        setIsModalOpen(true);
    };

    // Confirma o cancelamento e atualiza o estado (sem reload)
    const handleConfirmCancel = async () => {
        if (!selectedInscricao) return;

        try {
            // 1. Chama a API para inativar a inscrição
            await patchInscription(selectedInscricao.inscriptionId, {status: 'INACTIVE'});

            // 2. Atualiza o estado local removendo o evento da lista de "Próximos"
            setProximosEventos(prevEventos =>
                prevEventos.filter(evento => evento.inscriptionId !== selectedInscricao.inscriptionId)
            );

            // 3. Fecha o modal e limpa a seleção
            setIsModalOpen(false);
            setSelectedInscricao(null);

        } catch (error) {
            console.error("Erro ao cancelar inscrição:", error);
            // Aqui você poderia mostrar uma mensagem de erro ao usuário
        }
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-content">
                <h1>Meu Painel</h1>
                <a href={'/'}>CLIQUE</a>

                <section className="events-section">
                    <h2>Próximos Eventos</h2>
                    {proximosEventos.length > 0 ? proximosEventos.map(inscricao => (
                        <div key={inscricao.inscriptionId || inscricao.eventId} className="subscription-card">
                            <div className="card-info">
                                <h3>{inscricao.name}</h3>
                                <p><strong>Data:</strong> {new Date(inscricao.startDate).toLocaleDateString('pt-BR')}
                                </p>
                                <p><strong>Local:</strong> {inscricao.location}</p>
                                <p><strong>Status:</strong> <span className="status-inscrito">Inscrito</span></p>
                            </div>
                            <div className="card-actions">
                                {/* Se o evento está aqui, ele NÃO tem presença, então só pode cancelar */}
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
                        <div key={inscricao.inscriptionId || inscricao.eventId} className="subscription-card">
                            <div className="card-info">
                                <h3>{inscricao.name}</h3>
                                <p><strong>Data:</strong> {new Date(inscricao.startDate).toLocaleDateString('pt-BR')}
                                </p>
                                <p><strong>Local:</strong> {inscricao.location}</p>
                                <p><strong>Status:</strong> <span className="status-concluido">Concluído</span></p>
                            </div>
                            <div className="card-actions">
                                {/* Se o evento está aqui, ele TEM presença, então pode baixar certificado */}
                                <button className="action-button certificate-button">
                                    Baixar Certificado
                                </button>
                            </div>
                        </div>
                    )) : <p>Você não participou de nenhum evento ainda.</p>}
                </section>
            </div>

            {/* O Modal só é renderizado quando uma inscrição é selecionada */}
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