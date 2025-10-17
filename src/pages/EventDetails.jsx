import '../assets/css/EventDetails.css';
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import {useAuth} from "../Services/AuthContext.jsx";
import {postInscription, postUser} from "../Services/APIService.js";
import {useNavigate} from "react-router-dom";
import {useState} from "react";

const EventDetails = ({ event, onBack }) => {
    const imageUrl = "https://static-cse.canva.com/blob/1534622/eventocorporativo1.45438858.jpg";
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return localStorage.getItem('isAuthenticated') === 'true';
    });
    const [id, setId] = useState(() => {
        return localStorage.getItem('id') || null;
    });
    const navigate = useNavigate();


    const handleSubmit = async (event) => {
        event.preventDefault();
        if(isAuthenticated) {
            try{
                const result = await postInscription({event: event.id, user: id, status: "ACTIVE"});
                if(result.status === 201) {
                    //toast de success
                    navigate('/');
                }
            }catch (err){
                console.log(err);
                throw err;
            }
        }else{
            //logar
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
                    <button onClick={handleSubmit} className="register-button">
                        {!isAuthenticated ? 'Entrar na conta' : 'Inscrever-se agora'}
                        </button>
                </div>
            </div>
        </div>
        <Footer/>
        </div>
    );
};

export default EventDetails;