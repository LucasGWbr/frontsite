import React, { useState } from 'react';
import './RegistrationForm.css';
import {postUser} from "../Services/APIService.js";

const RegistrationForm = () => {
    // 1. Adicionar estados para os novos campos
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [document, setDocument] = useState('');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const status = "ACTIVE";

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setMessage('');
        try {
            const result = await postUser({
                name: name,
                email: email,
                password: password,
                document: document,
                phone: phone,
                status: status
            });
            if (result.status === 201) {
                setMessage("Conta criada com sucesso");
                setName('');
                setEmail('');
                setPassword('');
                setDocument('');
                setPhone('');
            }
        } catch (err) {
            setMessage("Erro ao criar conta");
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="registration-container">
            <form className="registration-form" onSubmit={handleSubmit}>
                <h2>Crie sua Conta</h2>
                <p>É rápido e fácil. Preencha os campos abaixo para começar.</p>

                <div className="input-group">
                    <label htmlFor="name">Nome Completo</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        disabled={isLoading}
                        placeholder="Seu nome completo"
                    />
                </div>

                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                        placeholder="exemplo@email.com"
                    />
                </div>

                {/* 2. Adicionar os novos campos no formulário */}
                <div className="input-group">
                    <label htmlFor="document">CPF</label>
                    <input
                        type="text"
                        id="document"
                        value={document}
                        onChange={(e) => setDocument(e.target.value)}
                        required
                        disabled={isLoading}
                        placeholder="Apenas números"
                    />
                </div>

                <div className="input-group">
                    <label htmlFor="phone">Telefone</label>
                    <input
                        type="tel"
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        disabled={isLoading}
                        placeholder="(XX) XXXXX-XXXX"
                    />
                </div>

                <div className="input-group">
                    <label htmlFor="password">Senha</label>
                    <input
                        type="password"
                        id="password"
                        disabled={isLoading}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Crie uma senha forte"
                    />
                </div>

                <button type="submit" className="register-button" disabled={isLoading}>
                    {isLoading ? 'Criando...' : 'Criar'}
                </button>

                <div className="form-footer">
                    <span>Já tem uma conta? </span>
                    <a href="/login">Faça login</a>
                </div>
                {message && <p>{message}</p>}
            </form>
        </div>
    );
};

export default RegistrationForm;