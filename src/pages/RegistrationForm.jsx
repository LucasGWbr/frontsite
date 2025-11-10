import React, { useState } from 'react';
import '../assets/css/RegistrationForm.css';
import {findUserId, getUser, postMail, postUser, putUser} from "../Services/APIService.js";
import toast from "react-hot-toast";
import {useNavigate} from "react-router-dom";

const RegistrationForm = () => {
    // 1. Adicionar estados para os novos campos
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [document, setDocument] = useState('');
    const [phone, setPhone] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const status = "ACTIVE";
    const [isPartner, setIsPartner] = useState(false);
    const navigate = useNavigate();



    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        try {
            let result;
            let userData = {};
            if(!isPartner){
                userData = {
                    name: name,
                    email: email,
                    password: password,
                    document: document,
                    phone: phone,
                    status: status
                }
                result = await postUser(userData);

            }else{
                const user = await findUserId(email);
                if(user.status === "ACTIVE"){
                    toast.error("Usuario ja cadastrado!");
                }else{
                    userData = {
                        id: user.id,
                        name: user.name,
                        email: email,
                        document: user.document,
                        password: password,
                        phone: phone,
                        status: status
                    }
                    result = await putUser(userData);
                }
            }
            if (result.status === 201 || result.status === 200) {
                await postMail({
                    to: email,
                    subject: "Bem vindo ao EventOS!",
                    text: `Sua conta foi criada com sucesso!`,
                });
                toast.success("Conta criada com sucesso");
                setName('');
                setEmail('');
                setPassword('');
                setDocument('');
                setPhone('');
                navigate('/login');
            }
        } catch (err) {
            toast.error("Erro ao criar conta");
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

                {/* NOVO: Checkbox para usuário parceiro */}
                <div className="input-group checkbox-group"> {/* Você pode precisar de CSS para .checkbox-group */}
                    <input
                        type="checkbox"
                        id="isPartner"
                        checked={isPartner}
                        onChange={(e) => setIsPartner(e.target.checked)}
                        disabled={isLoading}
                    />
                    <label htmlFor="isPartner" className="checkbox-label">
                        Tem cadastro parcial?
                    </label>
                </div>


                {/* MODIFICADO: Renderização condicional para Nome */}
                {!isPartner && (
                    <div className="input-group">
                        <label htmlFor="name">Nome Completo</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required={!isPartner} // Só é obrigatório se NÃO for parceiro
                            disabled={isLoading}
                            placeholder="Seu nome completo"
                        />
                    </div>
                )}

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

                {!isPartner && (
                    <div className="input-group">
                        <label htmlFor="document">CPF</label>
                        <input
                            type="text"
                            id="document"
                            value={document}
                            onChange={(e) => setDocument(e.target.value)}
                            required={!isPartner} // Só é obrigatório se NÃO for parceiro
                            disabled={isLoading}
                            placeholder="Apenas números"
                        />
                    </div>
                )}

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
                    {isLoading ? <div className="spinner"></div> : 'Criar'}
                </button>

                <div className="form-footer">
                    <span>Já tem uma conta? </span>
                    <a href="/login">Faça login</a>
                </div>
            </form>
        </div>
    );
};

export default RegistrationForm;