import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="main-footer">
            <div className="footer-content">
                <p>© 2025 EventOS. Todos os direitos reservados.</p>
                <div className="footer-links">
                    <a href="#">Sobre Nós</a>
                    <span>|</span>
                    <a href="#">Contato</a>
                    <span>|</span>
                    <a href="#">Política de Privacidade</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;