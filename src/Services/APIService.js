
const API_BASE_URL = 'http://177.44.248.80';
const API_PORT = {
    java: import.meta.env.VITE_APIJAVA,
    node: import.meta.env.VITE_APINODE
};


/**
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
    const response = await fetch(`${API_BASE_URL}:${API_PORT.java}/user/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            },
        body: JSON.stringify(userData),
    })
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response;
}
export const putUser = async (userData) => {
    const response = await fetch(`${API_BASE_URL}:${API_PORT.java}/user`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    })
    if (!response.ok){
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response;
}

export const postInscription = async (inscriptionData) => {
    const response = await fetch(`${API_BASE_URL}:${API_PORT.java}/inscription`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
        },
        body: JSON.stringify(inscriptionData),
    })
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response;
}

export const getInscriptionByUser = async (id) => {
    try{
        const response = await fetch(`${API_BASE_URL}:${API_PORT.java}/inscription/user/${id}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            },
        });
        if(response.status === 404){
            console.error("Inscrição não encontrada")
        }
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
        const response = await fetch(`${API_BASE_URL}:${API_PORT.java}/events/user/${id}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            },
        });
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
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + sessionStorage.getItem('token')
        },
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
        headers: {
            'Content-Type': 'application/json',
        },
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

export const postMail = async (email) => {
    const response = await fetch(`${API_BASE_URL}:${API_PORT.node}/email`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + import.meta.env.VITE_NODEKEY,
        },
        body: JSON.stringify(email),
    })
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response;
}

export const postCertificate = async (data) => {
    const response = await fetch(`${API_BASE_URL}:${API_PORT.node}/certificate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + import.meta.env.VITE_NODEKEY,
        },
        body: JSON.stringify(data),
    })
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response;
}
export const downloadCertificate = async (data) => {
    const response = await fetch(`${API_BASE_URL}:${API_PORT.node}/certificate/download`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + import.meta.env.VITE_NODEKEY,
        },
        body: JSON.stringify(data),
    })
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response;
}

export const getCertificateByUser = async (user_id,event_id) => {
    const response =  await fetch(`${API_BASE_URL}:${API_PORT.node}/certificate/user/${user_id}/${event_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + import.meta.env.VITE_NODEKEY,
        },
    })
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
}

export const postCertificateByHash = async (hash) => {
    const response = await fetch(`${API_BASE_URL}:${API_PORT.node}/certificate/verify`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + import.meta.env.VITE_NODEKEY,
        },
        body: JSON.stringify({hash}),
    })
    if (!response.ok) {
        console.log(`HTTP error! status: ${response.status}`);
    }
    return response;
}

// Você poderia adicionar outras funções aqui, como:
// export const getPostById = async (id) => { ... };
// export const createPost = async (postData) => { ... };