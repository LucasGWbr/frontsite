import React, { useState, useEffect } from 'react';
import {Link} from "react-router-dom";

// Componente para o Card de um único evento
const EventCard = ({ event }) => (
    <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '16px', margin: '8px', width: '300px' }}>
        <img src={event.imageUrl || 'https://via.placeholder.com/300x150'} alt={event.name} style={{ width: '100%', borderRadius: '4px' }} />
        <h3>{event.name}</h3>
        <p>{new Date(event.date).toLocaleDateString()}</p>
        <p>{event.description.substring(0, 100)}...</p>

        {/* 2. Substitua o botão por um Link que leva para a rota dinâmica */}
        <Link to={`/eventos/${event.id}`}>
            <button>Ver Detalhes</button>
        </Link>
    </div>
);

// Componente principal da lista de eventos
const EventList = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Simula uma chamada de API para GET /eventos
        const fetchEvents = async () => {
            try {
                // Em um projeto real, você usaria fetch() ou axios para chamar seu backend
                // const response = await fetch('http://localhost:3000/api/eventos');
                // const data = await response.json();

                // Dados de exemplo para demonstração
                const mockData = [
                    { id: 1, name: 'Palestra de Tecnologia', date: '2025-10-20T19:00:00', description: 'Um evento sobre as últimas tendências em desenvolvimento de software.' },
                    { id: 2, name: 'Workshop de Design UX/UI', date: '2025-11-05T09:00:00', description: 'Aprenda na prática os fundamentos de UX e UI com especialistas.' },
                ];

                setEvents(mockData); // Substitua por "data" quando a API estiver pronta
            } catch (err) {
                setError('Falha ao carregar eventos. Tente novamente mais tarde.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []); // O array vazio [] garante que o useEffect rode apenas uma vez

    if (loading) return <p>Carregando eventos...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div>
            <h2>Eventos Disponíveis</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {events.length > 0 ? (
                    events.map(event => <EventCard key={event.id} event={event} />)
                ) : (
                    <p>Nenhum evento encontrado.</p>
                )}
            </div>
        </div>
    );
};

export default EventList;