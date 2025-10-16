import React, {useEffect, useState} from 'react';
import './HomeScreen.css';
import EventDetails from './EventDetails';
import {getEvent} from "../Services/APIService.js";

// Dados mocados para simular uma chamada de API

const HomeScreen = () => {
    const [selectedEvent, setSelectedEvent] = useState(null);
    const imageUrl = "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200";
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const loadPosts = async () => {
            try {
                const data = await getEvent();
                setEvents(data);
            } catch (err) {
                // 3. Se getPosts() lançar um erro, nós o capturamos aqui
                setError('Não foi possível carregar os posts.');
                throw err;
            } finally {
                setLoading(false);
            }
        };

        loadPosts();
    }, []);
    if (loading) {
        return <p>Carregando posts...</p>;
    }

    if (error) {
        return <p>Erro: {error}</p>;
    }

    if (selectedEvent) {
        return <EventDetails event={selectedEvent} onBack={() => setSelectedEvent(null)} />;
    }

    return (
        <div className="homescreen-container">
            <header className="homescreen-header">
                <h1>Eventos Disponíveis</h1>
                <p>Explore os próximos eventos e garanta sua vaga.</p>
            </header>
            <div className="events-grid">
                {events.map(event => (
                    <div key={event.id} className="event-banner">
                        <img src={imageUrl} alt={event.name} className="event-image" />
                        <div className="event-info">
                            <h3>{event.name}</h3>
                            <p className="event-date">{event.startDate}</p>
                            <p>{event.description}</p>
                            <button className="details-button" onClick={() => setSelectedEvent(event)}>
                                Saber mais
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HomeScreen;