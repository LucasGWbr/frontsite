// src/services/ApiService.js

// A URL base da nossa API
const API_BASE_URL = 'http://localhost:8080';

/**
 * @returns {Promise<Array>} Uma promessa que resolve para um array de posts.
 * @throws {Error} Lança um erro se a requisição de rede falhar.
 */
export const getEvent = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/events`);

        if (!response.ok) {
            throw new Error('Falha na resposta da rede.');
        }

        return await response.json();

    } catch (error) {
        console.error("Erro ao buscar eventos:", error);
        throw error;
    }
};

// Você poderia adicionar outras funções aqui, como:
// export const getPostById = async (id) => { ... };
// export const createPost = async (postData) => { ... };