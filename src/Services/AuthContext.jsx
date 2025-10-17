// src/contexts/AuthContext.js
import React, { createContext, useState, useContext } from 'react';
import {postAuth} from "./APIService.js";

// 1. Cria o Contexto
const AuthContext = createContext(null);

// 2. Cria o Provedor do Contexto
// Este componente irá envolver sua aplicação e prover o estado de autenticação
export const AuthProvider = ({children}) => {
    // Aqui você guardaria o estado do usuário.
    // Para este exemplo, vamos usar um estado simples 'isAuthenticated'.
    // No mundo real, isso poderia ser um objeto com dados do usuário (token, nome, etc.)
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return localStorage.getItem('isAuthenticated') === 'true';
    });
    // Carrega user e id também, se existirem
    const [user, setUser] = useState(() => {
        return localStorage.getItem('user') || null;
    });
    const [id, setId] = useState(() => {
        return localStorage.getItem('id') || null;
    });


    // Funções para simular login e logout
    const login = async (email,password) => {
            // Lógica de login real aqui (ex: chamada de API)
            try {
                const result = await postAuth({email: email, password: password});
                if (result.ok) {
                    const json = await result.json();
                    localStorage.setItem('isAuthenticated', 'true');
                    localStorage.setItem('user', json.name);
                    localStorage.setItem('id', json.id);
                    setUser(json.name);
                    setId(json.id);
                    setIsAuthenticated(true);
                    return {
                        message: json,
                        isLoading: false,
                        isAuthenticated: true
                    }
                }
            } catch (error) {
                console.log(error);
                return {
                    message: 'Usuario ou senha incorretos',
                    isLoading: false,
                    isAuthenticated: false
                }
            }
            return {
                isLoading: false,
            }
        }
    ;

    const logout = () => {
        // Lógica de logout
        // 1. Limpa do localStorage
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('user');
        localStorage.removeItem('id');

        // 2. Limpa o estado do React
        setIsAuthenticated(false);
        setUser(null);
        setId(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{isAuthenticated, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};