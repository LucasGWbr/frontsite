// src/components/MySubscriptions.jsx

import React, { useState, useEffect } from 'react';

const MySubscriptions = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);

    // Simula a chamada para GET /inscricoes/{userId}
    useEffect(() => {
        const fetchSubscriptions = async () => {
            // Dados de exemplo
            const mockData = [
                { id: 101, eventName: 'Palestra de Tecnologia', eventDate: '2025-10-20', status: 'Check-in realizado', eventFinished: true },
                { id: 102, eventName: 'Workshop de Design UX/UI', eventDate: '2025-11-05', status: 'Inscrito', eventFinished: false },
            ];
            setSubscriptions(mockData);
            setLoading(false);
        };

        fetchSubscriptions();
    }, []);

    const handleCancel = (subscriptionId) => {
        // Lógica para chamar DELETE /inscricoes
        alert(`Inscrição ${subscriptionId} cancelada! (Simulação)`);
        setSubscriptions(subs => subs.filter(s => s.id !== subscriptionId));
    };

    const handleIssueCertificate = (subscriptionId) => {
        // Lógica para chamar POST /certificados
        alert(`Certificado para inscrição ${subscriptionId} emitido! (Simulação)`);
    };

    if (loading) return <p>Carregando inscrições...</p>;

    return (
        <div>
            <h2>Minhas Inscrições</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                <tr style={{ borderBottom: '2px solid black' }}>
                    <th style={{ textAlign: 'left', padding: '8px' }}>Evento</th>
                    <th style={{ textAlign: 'left', padding: '8px' }}>Status</th>
                    <th style={{ textAlign: 'left', padding: '8px' }}>Ações</th>
                </tr>
                </thead>
                <tbody>
                {subscriptions.map(sub => (
                    <tr key={sub.id} style={{ borderBottom: '1px solid #ccc' }}>
                        <td style={{ padding: '8px' }}>{sub.eventName}</td>
                        <td style={{ padding: '8px' }}>{sub.status}</td>
                        <td style={{ padding: '8px', display: 'flex', gap: '10px' }}>
                            {!sub.eventFinished && sub.status === 'Inscrito' && (
                                <button onClick={() => handleCancel(sub.id)}>Cancelar</button>
                            )}
                            {sub.eventFinished && sub.status === 'Check-in realizado' && (
                                <button onClick={() => handleIssueCertificate(sub.id)}>Emitir Certificado</button>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default MySubscriptions;