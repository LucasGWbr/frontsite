import '../assets/css/EventDetails.css';
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import {getInscriptionByUser, postInscription, postMail} from "../Services/APIService.js";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import toast from 'react-hot-toast';

const EventDetails = ({ event, onBack }) => {
    const imageUrl = "https://static-cse.canva.com/blob/1534622/eventocorporativo1.45438858.jpg";
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return localStorage.getItem('isAuthenticated') === 'true';
    });
    const [id, setId] = useState(() => {
        return localStorage.getItem('id') || null;
    });
    const [email, setEmail] = useState(() => {
        return localStorage.getItem('email') || null;
    });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [isInscripted, setIsInscripted] = useState(false);

    useEffect(() => {
        const verifyEvent = async () => {
            if(id != null){
                const data = await getInscriptionByUser(id);
                const inscript = data.find(inscription => inscription.eventId === event.eventId);
                if(inscript && (inscript.status === 'INSCRIPT' || inscript.status === 'PRESENCE')) {
                    setIsInscripted(true);
                }
            }
        };

        verifyEvent();
    }, [event.eventId, id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(isAuthenticated) {
            setIsLoading(true);
            try{
                const result = await postInscription({ user: id, event: event.eventId, status: "INSCRIPT"});
                console.log(result);
                if(result.status === 201 || result.status === 200) {
                    toast.success("Inscrição realizada com sucesso!");
                    await postMail({to: email, subject: "Inscrição realizada", text: `Inscrição realizada com sucesso curso de ${event.name}!` });
                    setIsLoading(false);
                    onBack();
                }
            }catch (err){
                toast.error("Erro ao realizar inscrição!")
                setIsLoading(false);
                console.log(err);
                throw err;
            }
        }else{
            navigate('/login');
        }

    };


    return (
        <div>
            <Header/>
        <div className="details-container">
            <div className="details-card">
                <button onClick={onBack} className="back-button">
                    &larr; Voltar para todos os eventos
                </button>
                <img src={imageUrl} alt={event.name} className="details-image" />
                <div className="details-content">
                    <h1>{event.name}</h1>
                    <p className="details-meta">
                        <span>📅 {new Date(event.startDate).toLocaleDateString('pt-BR')}</span>
                        <span>⏱️ {new Date(event.startDate).toLocaleTimeString('pt-BR')}</span>
                        <span>📍 {event.location}</span>
                    </p>
                    <p className="details-description">{event.description}</p>
                    <button onClick={handleSubmit} className="register-button" disabled={isInscripted || isLoading}>
                        {!isAuthenticated ? 'Entrar na conta' : isInscripted ? 'Você ja esta inscrito' : 'Inscrever-se agora'}
                        </button>
                </div>
            </div>
        </div>
        <Footer/>
        </div>
    );
};

export default EventDetails;