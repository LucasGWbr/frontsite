
const API_BASE_URL = 'http://localhost';
const API_PORT = {
    java: import.meta.env.VITE_APIJAVA,
    node: import.meta.env.VITE_APINODE
};

/**
 * @returns {Promise<Array>} Uma promessa que resolve para um array de posts.
 * @throws {Error} Lança um erro se a requisição de rede falhar.
 */
export const getEvent = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}:${API_PORT.java}/events`);

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
        const response = await fetch(`${API_BASE_URL}:${API_PORT.java}/auth`, {
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
    const response = await fetch(`${API_BASE_URL}:${API_PORT.java}/user`, {
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
    const response = await fetch(`${API_BASE_URL}:${API_PORT.java}/inscription`, {
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
        const response = await fetch(`${API_BASE_URL}:${API_PORT.java}/inscription/user/${id}`);
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
        const response = await fetch(`${API_BASE_URL}:${API_PORT.java}/events/user/${id}`);
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
    const response = await fetch(`${API_BASE_URL}:${API_PORT.java}/inscription/${id}`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(status),
    })
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response;
}
export const getUser = async (email) => {
    const response = await fetch(`${API_BASE_URL}:${API_PORT.java}/user?email=${email}`, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
    })
    if(!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response;
}

export const findUserId = async (email) => {

    try{
        const result = await getUser(email);
        if(result.status === 200){
            return result.json();
        }else{
            return null;
        }
    }catch(err){
        console.log(err);
        throw err;
    }
}

export const postPresence = async (presenceData) => {
    console.log(presenceData);
    const response = await fetch(`${API_BASE_URL}:${API_PORT.node}/presence`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(presenceData),
    })
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response;
}

// Você poderia adicionar outras funções aqui, como:
// export const getPostById = async (id) => { ... };
// export const createPost = async (postData) => { ... };