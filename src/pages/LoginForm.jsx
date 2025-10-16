import React, { useState } from 'react';
import './LoginForm.css';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        // Aqui você adicionaria a lógica de autenticação
        console.log('Tentativa de login com:', { email, password });
        alert('Login enviado! (Verifique o console)');
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Acesse sua Conta</h2>
                <p>Bem-vindo de volta! Por favor, insira seus dados.</p>
                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="exemplo@email.com"
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Senha</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Digite sua senha"
                    />
                </div>
                <button type="submit" className="login-button">
                    Entrar
                </button>
                <div className="form-footer">
                    <a href="#">Esqueceu a senha?</a>
                </div>
            </form>
        </div>
    );
};

export default LoginForm;