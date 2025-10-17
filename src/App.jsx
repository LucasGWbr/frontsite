// src/App.jsx

import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';

// Importe seus componentes
import LoginForm from './pages/LoginForm.jsx';
import HomeScreen from "./pages/HomeScreen.jsx";
import RegistrationForm from "./pages/RegistrationForm.jsx";
// ...

function App() {
    return (
        // Usamos a classe do index.html
        <div className="full-page-container">
            <Routes>
                <Route path="/" element={<HomeScreen />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/register" element={<RegistrationForm/>} />
                    {/* ... outras rotas */}
            </Routes>
        </div>
    );
}

export default App;