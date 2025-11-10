// src/contexts/AuthContext.js
import React, {createContext, useState, useContext, useEffect} from 'react';
import {findUserId, postAuth, postMail, postPresence} from "./APIService.js";
import localforage from "localforage";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

export const AuthProvider = ({children}) => {
    useEffect(() => {
        // 1. Tenta sincronizar assim que o app carrega (caso já esteja online)
        if (navigator.onLine) {
            syncPendingCheckins();
        }

        // 2. Adiciona o "escutador" para quando a internet VOLTAR
        window.addEventListener('online', syncPendingCheckins);

        // 3. Limpeza do efeito quando o componente desmontar
        return () => {
            window.removeEventListener('online', syncPendingCheckins);
        };
    }, []);

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
    const [email, setEmail] = useState(() => {
        return localStorage.getItem('email') || null;
    });

    localforage.config({
        name: 'presenceUserRegistration',
        storeName: 'checkinsUserPendentes'
    });
    const syncPendingCheckins = async () => {
        console.log('Verificando check-ins pendentes...');

        // Pega todas as chaves salvas na loja 'checkinsPendentes'
        const keys = await localforage.keys();
        // Filtra apenas as chaves de check-in
        const checkinKeys = keys.filter(key => key.startsWith('checkin_'));

        if (checkinKeys.length === 0) {
            console.log('Nenhum check-in pendente.');
            return;
        }

        toast.loading('Sincronizando check-ins pendentes...');

        for (const key of checkinKeys) {
            try {
                const checkinData = await localforage.getItem(key);


                const user = await findUserId(checkinData.emailUser);
                try {
                    const status = "ACTIVE";
                    const result = await postPresence({idUser: user.id, idEvent: checkinData.idEvent, status: status});
                    if (result.status === 201 || result.status === 200) {
                        await localforage.removeItem(key);
                        await postMail({
                           to: user.email,
                            subject: "Presença confirmada",
                            text: "Sua presença foi confirmada com sucesso!",
                        });
                        toast.success('Um check-in pendente foi sincronizado!');
                    }else {
                        toast.error(`Falha ao sincronizar o check-in ${key}.`);
                    }
                    } catch (err) {
                    toast.error("Erro ao realizar inscrição!")
                    console.log(err);
                    throw err;
                }

            } catch (error) {
                // Deu erro de rede no meio da sincronização,
                // pare de tentar por agora.
                toast.error('Falha na sincronização. Tentaremos mais tarde.');
                break; // Sai do loop e espera o próximo evento 'online'
            }
        }
        toast.dismiss(); // Remove o "loading"
    };

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
                    localStorage.setItem('email', json.email);
                    setUser(json.name);
                    setId(json.id);
                    setEmail(json.email);
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

    const logout = async () => {
        // Lógica de logout
        // 1. Limpa do localStorage
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('user');
        localStorage.removeItem('id');
        localStorage.removeItem('email');

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