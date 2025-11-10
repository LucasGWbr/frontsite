import React, {useEffect, useState} from 'react';
import '../assets/css/UserDashboard.css';
import ConfirmationModal from "../components/ConfirmationModal.jsx";
import {downloadCertificate, getEventByUser, patchInscription, postMail} from "../Services/APIService.js";
import Header from "../components/Header.jsx";

const UserDashboard = () => {
    // Estados para as listas filtradas
    const [proximosEventos, setProximosEventos] = useState([]);
    const [eventosAnteriores, setEventosAnteriores] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Estados de controle do modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedInscricao, setSelectedInscricao] = useState(null);

    // Estado para o ID do usuário
    const [id, setId] = useState(() => {
        return localStorage.getItem('id') || null;
    });
    const [email, setEmail] = useState(() => {
        return localStorage.getItem('email') || null;
    });

    // Efeito para carregar e filtrar os dados na inicialização
    useEffect(() => {
        const loadAndFilterEvents = async () => {
            if (id !== null) {
                try {

                    const userEvents = await getEventByUser(id);
                    console.log(userEvents);
                    const proximos = userEvents.filter(i => i.status === "INSCRIPT");
                    const anteriores = userEvents.filter(i => i.status === "PRESENCE");


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
        setIsLoading(true);
        try {
            // 1. Chama a API para inativar a inscrição
            await patchInscription(selectedInscricao.inscriptionId, {status: 'INACTIVE'});
            await postMail({
                to: email,
                subject: "Cancelamento de inscrição",
                text: `Inscrição cancelada com sucesso!`,
            });

            // 2. Atualiza o estado local removendo o evento da lista de "Próximos"
            setProximosEventos(prevEventos =>
                prevEventos.filter(evento => evento.inscriptionId !== selectedInscricao.inscriptionId)
            );

            // 3. Fecha o modal e limpa a seleção
            setIsModalOpen(false);
            setSelectedInscricao(null);
            setIsLoading(false);

        } catch (error) {
            console.error("Erro ao cancelar inscrição:", error);
            setIsLoading(false);
            // Aqui você poderia mostrar uma mensagem de erro ao usuário
        }
    };

    const handleDownload = async (inscricao) => {
        try {
            setIsLoading(true);
            const response = await downloadCertificate({
                name: inscricao.userName,
                eventName: inscricao.name,
                hash: 'temporary',
                date: inscricao.startDate
            });
            console.log(response);

            const blob = await response.blob();

            const url = window.URL.createObjectURL(blob);

            // 3. Cria um link <a> invisível para iniciar o download
            const link = document.createElement('a');
            link.href = url;

            // Pega o nome do arquivo do header (se o backend enviar) ou define um padrão
            const filename = `Certificado_${inscricao.name}.pdf`;
            link.setAttribute('download', filename);

            // 4. Adiciona o link ao corpo, clica nele e remove
            document.body.appendChild(link);
            link.click();

            // 5. Limpa (remove o link e a URL temporária)
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);

        } catch (err) {
            console.error('Erro ao baixar certificado:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <Header/>
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
                                    <p>
                                        <strong>Data:</strong> {new Date(inscricao.startDate).toLocaleDateString('pt-BR')}
                                    </p>
                                    <p><strong>Local:</strong> {inscricao.location}</p>
                                    <p><strong>Status:</strong> <span className="status-inscrito">Inscrito</span></p>
                                </div>
                                <div className="card-actions">
                                    {/* Se o evento está aqui, ele NÃO tem presença, então só pode cancelar */}
                                    <button
                                        className="action-button cancel-button"
                                        onClick={() => handleCancelClick(inscricao)}
                                        disabled={isLoading}
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
                                    <p>
                                        <strong>Data:</strong> {new Date(inscricao.startDate).toLocaleDateString('pt-BR')}
                                    </p>
                                    <p><strong>Local:</strong> {inscricao.location}</p>
                                    <p><strong>Status:</strong> <span className="status-concluido">Concluído</span></p>
                                </div>
                                <div className="card-actions">
                                    {/* Se o evento está aqui, ele TEM presença, então pode baixar certificado */}
                                    <button disabled={isLoading} onClick={() => handleDownload(inscricao)} className="action-button certificate-button">
                                        {isLoading ? <div className="spinner"></div> : 'Baixar Certificado'}
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
                        isLoading={isLoading}
                    />
                )}
            </div>
        </div>
    );
};

export default UserDashboard;