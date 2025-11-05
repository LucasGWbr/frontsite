import React, {useEffect, useState} from 'react';
import toast from 'react-hot-toast';
import '../assets/css/PresenceRegistration.css';
import {findUserId, getEvent, getUser, postPresence, postUser} from "../Services/APIService.js";
import localforage from 'localforage';

const PresenceRegistration = ({ eventName }) => {

    localforage.config({
        name: 'presenceUserRegistration',
        storeName: 'checkinsUserPendentes', // Nome específico para esta tarefa
        description: 'Armazena registros de presença e usuarios offline.'
    });

    // Estados para o Formulário 1 (Usuário Existente)
    const [existingIdentifier, setExistingIdentifier] = useState('');

    // Estados para o Formulário 2 (Novo Usuário)
    const [newName, setNewName] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newCpf, setNewCpf] = useState('');
    const [events, setEvents] = useState([]);
    const [selectedKit, setSelectedKit] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadEvent = async () => {
            try {
                const data = await getEvent();
                setEvents(data);
            } catch (err) {
                // 3. Se getPosts() lançar um erro, nós o capturamos aqui
                setError('Não foi possível carregar os eventos.');
                throw err;
            } finally {
                setLoading(false);
            }
        };

        loadEvent();
    }, []);
    if (loading) {
        return <p>Carregando posts...</p>;
    }

    if (error) {
        return <p>Erro: {error}</p>;
    }
    // Fluxo 1: Lidar com o check-in de usuário existente

    const handleExistingUserSubmit = async (e) => {
        e.preventDefault();
        if(navigator.onLine){
            const user = await findUserId(existingIdentifier);
            try {
                const status = "ACTIVE";
                const result = await postPresence({idUser: user.id, idEvent: selectedKit, status: status});
                if (result.status === 201 || result.status === 200) {
                    toast.success("Inscrição realizada com sucesso!");
                }
            } catch (err) {
                toast.error("Erro ao realizar inscrição!")
                console.log(err);
                throw err;
            }
        }else{
            try {
                // Gera uma chave única para este check-in pendente
                const key = `checkin_${Date.now()}`;
                await localforage.setItem(key, {emailUser:existingIdentifier, idEvent: selectedKit, status: status});

                toast.success('Você está offline. Seu check-in foi salvo e será enviado assim que a conexão voltar!');

                // Limpar tela, redirecionar, etc.
            } catch (err) {
                toast.error('Erro ao salvar o check-in localmente.');
                throw err;
            }
        }


    };

    // Fluxo 2: Lidar com o cadastro parcial de novo usuário
    const handleNewUserSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await postUser({
                name: newName,
                email: newEmail,
                document: newCpf,
                password: "000",
                status: "INACTIVE"
            });
            if(result.status === 201 || result.status === 202) {
                toast.success("Usuario criado com sucesso!");
            }

        } catch (err) {
            console.log(err);
            throw err;
        }
    };

    return (
        <div className="presence-container">
            <div className="presence-card">
                <h1 className="presence-title">Registro de Presença</h1>
                <h2 className="event-title">{eventName}</h2>

                {/* --- Seção 1: Usuário Existente --- */}
                <form onSubmit={handleExistingUserSubmit} className="presence-form">
                    <h3>Já é cadastrado? Faça seu check-in.</h3>
                    <div className="input-group">
                        <label htmlFor="kit-select">Kit de Boas-Vindas</label>
                        <select
                            id="kit-select"
                            value={selectedKit}
                            onChange={(e) => setSelectedKit(e.target.value)}
                            required
                        >
                            <option value="" disabled>Selecione uma opção...</option>
                            {events.map(event => (
                                <option key={event.eventId} value={event.eventId}>
                                    {event.name}
                                </option>
                            ))}
                        </select>
                        <label htmlFor="identifier">Email ou CPF</label>
                        <input
                            type="text"
                            id="identifier"
                            placeholder="Digite seu email ou CPF"
                            value={existingIdentifier}
                            onChange={(e) => setExistingIdentifier(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="presence-button primary">
                        Registrar Presença
                    </button>
                </form>

                <div className="divider">
                    <span>OU</span>
                </div>

                {/* --- Seção 2: Novo Usuário (Cadastro Parcial) --- */}
                <form onSubmit={handleNewUserSubmit} className="presence-form">
                    <h3>Novo por aqui? Cadastre-se para participar.</h3>
                    <div className="input-group">
                        <label htmlFor="name">Nome Completo</label>
                        <input
                            type="text"
                            id="name"
                            placeholder="Seu nome (para o certificado)"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="email">E-mail</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Email para contato e login"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="cpf">CPF (Opcional)</label>
                        <input
                            type="text"
                            id="cpf"
                            placeholder="Recomendado para certificados"
                            value={newCpf}
                            onChange={(e) => setNewCpf(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="presence-button secondary">
                        Cadastrar e Registrar Presença
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PresenceRegistration;