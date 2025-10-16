import React from 'react';
import './EventDetails.css';

const EventDetails = ({ event, onBack }) => {
    return (
        <div className="details-container">
            <div className="details-card">
                <button onClick={onBack} className="back-button">
                    &larr; Voltar para todos os eventos
                </button>
                <img src={event.imageUrl} alt={event.title} className="details-image" />
                <div className="details-content">
                    <h1>{event.title}</h1>
                    <p className="details-meta">
                        <span>📅 {event.date}</span>
                        <span>📍 {event.location}</span>
                    </p>
                    <p className="details-description">{event.longDescription}</p>
                    <button className="register-button">Inscrever-se agora</button>
                </div>
            </div>
        </div>
    );
};

export default EventDetails;