const BASE_URL = 'http://localhost:5174/api';

async function loginUser(username, password) {
    const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username, password: password }),
    });
    const user = await response.json();

    return user;
}

async function registerUser(username, email, password) {
    const response = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: username,
            email: email,
            password: password,
        }),
    });

    const user = await response.json();
    return user;
}

export { loginUser, registerUser };
