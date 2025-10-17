// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';

const ProtectedRoute = () => {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        // Se o usuário não estiver autenticado, redireciona para a página inicial
        // A propriedade 'replace' evita que o usuário volte para a rota protegida no histórico do navegador
        return <Navigate to="/" replace />;
    }

    // Se estiver autenticado, renderiza o conteúdo da rota filha (usando Outlet)
    return <Outlet />;
};

export default ProtectedRoute;