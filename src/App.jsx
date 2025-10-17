// src/App.jsx

import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';

// Importe seus componentes
import LoginForm from './pages/LoginForm.jsx';
import HomeScreen from "./pages/HomeScreen.jsx";
import RegistrationForm from "./pages/RegistrationForm.jsx";
import ProtectedRoute from "./Services/ProtectedRoute.jsx";
import UserDashboard from "./pages/UserDashboard.jsx";
import {AuthProvider} from "./Services/AuthContext.jsx";
// ...

function App() {
    return (
        // Usamos a classe do index.html
        <div className="full-page-container">
            <AuthProvider>

            <Routes>
                <Route path="/" element={<HomeScreen />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/register" element={<RegistrationForm/>} />
                    {/* ... outras rotas */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<UserDashboard />} />
                    {/* Adicione outras rotas que precisam de sessão aqui */}
                </Route>
            </Routes>
                </AuthProvider>


        </div>
    );
}

export default App;