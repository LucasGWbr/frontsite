import React, {useEffect, useState} from 'react';
import '../assets/css/HomeScreen.css';
import EventDetails from './EventDetails';
import {getEvent} from "../Services/APIService.js";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";

// Dados mocados para simular uma chamada de API

const HomeScreen = () => {
    const [selectedEvent, setSelectedEvent] = useState(null);
    const imageUrl = "https://static-cse.canva.com/blob/1534622/eventocorporativo1.45438858.jpg";
    const [events, setEvents] = useState([]);
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

    if (selectedEvent) {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // 'auto' ou 'smooth'
        });
        return <EventDetails event={selectedEvent} onBack={() => setSelectedEvent(null)} />;
    }

    return (
        <div className="HomeScreen">
        <Header />
        <div className="homescreen-container">

            <header className="homescreen-header">
                <h1>Eventos Disponíveis</h1>
                <p>Explore os próximos eventos e garanta sua vaga.</p>
            </header>
            <div className="events-grid">
                {events.map(event => (
                    <div key={event.eventId} className="event-banner">
                        <img src={imageUrl} alt={event.name} className="event-image" />
                        <div className="event-info">
                            <h3>{event.name}</h3>
                            <p className="event-date">{new Date(event.startDate).toLocaleDateString('pt-BR')}</p>
                            <p>{event.description}</p>
                            <button className="details-button" onClick={() => setSelectedEvent(event)}>
                                Saber mais
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
            <Footer />
        </div>
    );
};

export default HomeScreen;