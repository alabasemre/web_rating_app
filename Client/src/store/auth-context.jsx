import { createContext } from 'react';

const AuthContext = createContext({
    user: null,
    isLoggedIn: false,
    role: null,
    register: () => {},
    login: () => {},
    logout: () => {},
});

export default AuthContext;
