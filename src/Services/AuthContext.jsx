// src/contexts/AuthContext.js
import React, {createContext, useState, useContext, useEffect, useRef} from 'react';
import {inscriptUser, postAuth, postUser} from "./APIService.js";
import localforage from "localforage";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

export const AuthProvider = ({children}) => {
    const isSyncing = useRef(false);
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
        return sessionStorage.getItem('isAuthenticated') === 'true';
    });
    const [token, setToken] = useState(() => {
        return sessionStorage.getItem('token') || null;
    });
    // Carrega user e id também, se existirem
    const [user, setUser] = useState(() => {
        return sessionStorage.getItem('user') || null;
    });
    const [id, setId] = useState(() => {
        return sessionStorage.getItem('id') || null;
    });
    const [email, setEmail] = useState(() => {
        return sessionStorage.getItem('email') || null;
    });

    localforage.config({
        name: 'presenceUserRegistration',
        storeName: 'checkinsUserPendentes'
    });
    const syncPendingCheckins = async () => {
        if(isSyncing.current){
            return;
        }
        isSyncing.current = true;

        console.log('Verificando check-ins pendentes...');

        // Pega todas as chaves salvas na loja 'checkinsPendentes'
        const keys = await localforage.keys();
        // Filtra apenas as chaves de check-in
        const checkinKeys = keys.filter(key => key.startsWith('checkin_'));
        const userCheckinKeys = keys.filter(key => key.startsWith('checkinUser_'));

        if (checkinKeys.length === 0 && userCheckinKeys.length === 0) {
            console.log('Nenhum check-in pendente.');
            isSyncing.current = false;
            return;
        }
        try{
            if(userCheckinKeys.length > 0) {
                toast.loading('Sincronizando check-ins pendentes...');
                for(const key of userCheckinKeys) {
                    try{
                        const checkin = await localforage.getItem(key);
                        const result = await postUser({
                            name: checkin.userName,
                            email: checkin.emailUser,
                            document: checkin.document,
                            password: "000",
                            status: "INACTIVE"
                        });
                        if (result.status === 201 || result.status === 200) {
                            const response = await inscriptUser(checkin.emailUser,checkin.idEvent);
                            if(response.status === 201 || response.status === 200){
                                await localforage.removeItem(key);
                                toast.success('Um check-in pendente foi sincronizado!');
                            }
                        }else{
                            toast.error('Usuario já existe.');
                        }
                    }catch(err) {
                        console.log(err);
                    }
                }
            }

            if(checkinKeys.length > 0) {
                toast.loading('Sincronizando check-ins pendentes...');
                for (const key of checkinKeys) {
                    try {
                        const checkinData = await localforage.getItem(key);
                        try {
                            const result = await inscriptUser(checkinData.emailUser,checkinData.idEvent);
                            if (result.status === 201 || result.status === 200) {
                                await localforage.removeItem(key);
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
                        console.error(error);
                        toast.error('Falha na sincronização. Tentaremos mais tarde.');
                        break; // Sai do loop e espera o próximo evento 'online'
                    }
                }
            }
        }catch(e){
            console.error(e);
        }finally {
            isSyncing.current = false;
            toast.dismiss();
        }
    };

    // Funções para simular login e logout
    const login = async (email,password) => {
            // Lógica de login real aqui (ex: chamada de API)
            try {
                const result = await postAuth({email: email, password: password});
                if (result.ok) {
                    const json = await result.json();
                    sessionStorage.setItem('token', json.token );
                    sessionStorage.setItem('isAuthenticated', 'true');
                    sessionStorage.setItem('user', json.name);
                    sessionStorage.setItem('id', json.id);
                    sessionStorage.setItem('email', json.email);
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
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('isAuthenticated');
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('id');
        sessionStorage.removeItem('email');

        // 2. Limpa o estado do React
        setIsAuthenticated(false);
        setUser(null);
        setId(null);
        setIsAuthenticated(false);
        setToken(null);
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