import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
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
                <nav>
                    <Link to="/login" className="header-login-button">
                        Login
                    </Link>
                </nav>
            </div>
        </header>
    );
};

export default Header;