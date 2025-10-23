import React, {useState, useEffect, useRef} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import '../assets/css/Header.css';
import { useAuth} from "../Services/AuthContext.jsx";

const Header = () => {
    // Seu estado de autenticação original (mantido)
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return localStorage.getItem('isAuthenticated') === 'true';
    });

    // Novo estado para controlar o menu dropdown
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navigate = useNavigate();
    const {logout} = useAuth();
    const menuRef = useRef(null); // Ref para detectar cliques fora do menu

    // Função para lidar com o logout
    const handleLogout = () => {
        logout();
        // Mantive o reload, como no seu código original
        window.location.reload();
    };

    // Efeito para fechar o menu ao clicar fora dele
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        // Adiciona o listener
        document.addEventListener('mousedown', handleClickOutside);

        // Remove o listener ao desmontar o componente
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [menuRef]);

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
                    {!isAuthenticated ? (
                        // Botão de Login (se não estiver autenticado)
                        <button
                            onClick={() => navigate('/login')}
                            className="header-login-button"
                        >
                            Login
                        </button>
                    ) : (
                        // Container do Menu (se estiver autenticado)
                        <div className="menu-container" ref={menuRef}>
                            {/* Botão Hamburger */}
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="hamburger-button"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                >
                                    <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
                                </svg>
                            </button>

                            {/* Menu Dropdown */}
                            {isMenuOpen && (
                                <div className="dropdown-menu">
                                    <button
                                        onClick={() => {
                                            navigate('/dashboard');
                                            setIsMenuOpen(false); // Fecha o menu ao navegar
                                        }}
                                        className="dropdown-item"
                                    >
                                        Meus treinamentos
                                    </button>
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setIsMenuOpen(false); // Fecha o menu ao sair
                                        }}
                                        className="dropdown-item"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;