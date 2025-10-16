// src/App.jsx

import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';

// Importe seus componentes
import EventList from './components/EventList';
import LoginForm from './pages/LoginForm.jsx';
import HomeScreen from "./pages/HomeScreen.jsx";
// ...

function App() {
    return (
        // Usamos a classe do index.html
        <div className="full-height-container">
            <header>
                <nav style={{ padding: '1rem', background: '#f0f0f0', borderBottom: '1px solid #ddd' }}>
                    <Link to="/" style={{ marginRight: '1rem' }}>Eventos</Link>
                    <Link to="/login" style={{ float: 'right' }}>Login</Link>
                </nav>
            </header>
                <Routes>
                    <Route path="/" element={<HomeScreen />} />
                    <Route path="/login" element={<LoginForm />} />
                    {/* ... outras rotas */}
                </Routes>
            <footer style={{ padding: '1rem', background: '#f0f0f0', textAlign: 'center', borderTop: '1px solid #ddd' }}>
                <p>© 2025 - Sistema de Eventos</p>
            </footer>
        </div>
    );
}

export default App;