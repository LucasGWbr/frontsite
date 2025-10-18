import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import '../assets/css/Header.css';
import { useAuth} from "../Services/AuthContext.jsx";

const Header = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return localStorage.getItem('isAuthenticated') === 'true';
    });
    const [user, setUser] = useState(() => {
        return localStorage.getItem('user') || null;
    });
    const [button, setButton] = useState('');
    const navigate = useNavigate();
    const {logout} = useAuth();

    if(button === 'Login'){
        navigate('/login');
    }else if(button === 'Logout'){
        const response = logout();
        window.location.reload();
    }
    return (
        <header className="main-header">
            <div className="header-content">
                <Link to="/" className="home-link">
                    {/* SVG do ícone "home" */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                    >
                        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                    </svg>
                    <span>EventOS</span>
                </Link>
                <nav >
                    <button
                        onClick={() => setButton(isAuthenticated ? 'Logout' : 'Login')}
                        className="header-login-button"
                    >
                        {isAuthenticated ? 'Logout' : 'Login'}
                    </button>
                </nav>
            </div>
        </header>
    );
};

export default Header;