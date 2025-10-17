import React, { useState } from 'react';
import './LoginForm.css';
import {postAuth} from "../Services/APIService.js";

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setMessage('');
        try {
            const result = await postAuth({email: email, password: password});
            if (result.status === 200) {
                setMessage(await result.text());
            }
        } catch (error) {
            setMessage('ERROR');
            //vai vir sempre aqui, api retorna 401
            throw error;
        } finally {
            setIsLoading(false);
        }
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
                        disabled={isLoading}
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
                        disabled={isLoading}
                        placeholder="Digite sua senha"
                    />
                </div>
                <button type="submit" className="login-button" disabled={isLoading}>
                    {isLoading ? 'Entrando...' : 'Entrar'}
                </button>
                <div className="form-footer">
                    <a href="#">Esqueceu a senha?</a>
                    <a href="/register">Criar conta</a>
                </div>
                {message && <p>{message}</p>}
            </form>
        </div>
    );
};

export default LoginForm;