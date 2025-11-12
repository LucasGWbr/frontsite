import React, { useState } from 'react';
import '../assets/css/LoginForm.css';
import {useAuth} from "../Services/AuthContext.jsx";
import { useNavigate } from 'react-router-dom';
import toast from "react-hot-toast";

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const {login} = useAuth();
    const navigate = useNavigate();


    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        const loginStatus = await login(email, password);
        setIsLoading(loginStatus.isLoading);
        if (loginStatus.isAuthenticated) {
            navigate('/');
        }else{
            toast.error(loginStatus.message);
            setPassword('');
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
                    {isLoading ? <div className="spinner"></div> : 'Entrar'}
                </button>
                <div className="form-footer">
                    <a href="/register">Criar conta</a>
                </div>
            </form>
        </div>
    );
};

export default LoginForm;