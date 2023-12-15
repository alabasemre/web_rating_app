const BASE_URL = 'http://localhost:5174/api';

async function changeProfilePicture(formData, token) {
    try {
        const resp = await fetch(`${BASE_URL}/users/add-photo`, {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + token,
            },
            body: formData,
        });

        if (resp.ok) {
            const newPhoto = await resp.json();
            return { photo: newPhoto, error: false };
        }
    } catch (error) {
        return JSON.parse(error);
    }
}

async function getUserStats(token) {
    try {
        const resp = await fetch(`${BASE_URL}/users/stats`, {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + token,
            },
        });

        if (resp.ok) {
            const stats = await resp.json();
            return { data: stats, error: false };
        }
    } catch (error) {
        return JSON.parse(error);
    }
}

export { changeProfilePicture, getUserStats };
