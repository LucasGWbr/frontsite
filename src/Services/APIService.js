
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

export const postAuth = async (authData) => {
        const response = await fetch(`${API_BASE_URL}/auth`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(authData),
        })
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response;
}

export const postUser = async (userData) => {
    const response = await fetch(`${API_BASE_URL}/usuarios`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(userData),
    })
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response;
}

export const postInscription = async (inscriptionData) => {
    const response = await fetch(`${API_BASE_URL}/inscription`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(inscriptionData),
    })
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response;
}

export const getInscriptionByUser = async (id) => {
    try{
        const response = await fetch(`${API_BASE_URL}/inscription/user/${id}`);
        if (!response.ok) {
            throw new Error('Falha na resposta da rede.');
        }
        return await response.json();
    } catch (error) {
    console.error("Erro ao buscar inscrições:", error);
    throw error;
    }

}

export const getEventByUser = async (id) => {
    try{
        const response = await fetch(`${API_BASE_URL}/events/user/${id}`);
        if (!response.ok) {
            throw new Error('Falha na resposta da rede.');
        }
        return await response.json();
    } catch (error) {
        console.error("Erro ao buscar inscrições:", error);
        throw error;
    }

}

export const patchInscription = async (id, status) => {
    const response = await fetch(`${API_BASE_URL}/inscription/${id}`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(status),
    })
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response;
}

// Você poderia adicionar outras funções aqui, como:
// export const getPostById = async (id) => { ... };
// export const createPost = async (postData) => { ... };