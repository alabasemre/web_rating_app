import { useReducer } from 'react';
import PropTypes from 'prop-types';
import AuthContext from './auth-context';
import { loginUser, registerUser } from '../services/AuthService';

const defaultAuthState = {
    user: JSON.parse(localStorage.getItem('user')),
    isLoggedIn: localStorage.getItem('user') ? true : false,
};

const authReducer = (state, action) => {
    if (action.type === 'LOGIN') {
        return { isLoggedIn: true, user: action.user };
    }
    if (action.type === 'LOGOUT') {
        return { isLoggedIn: false, user: null };
    }
};

const AuthProvider = ({ children }) => {
    const [authState, authActions] = useReducer(authReducer, defaultAuthState);

    const loginHandler = async (username, password) => {
        const user = await loginUser(username, password);

        if (user.token !== undefined) {
            user.role = JSON.parse(atob(user.token.split('.')[1])).role;
            localStorage.setItem('user', JSON.stringify(user));
            authActions({ type: 'LOGIN', user: user });
        }
    };

    const registerHandler = async (username, email, password) => {
        const user = await registerUser(username, email, password);

        if (user?.token !== undefined) {
            user.role = JSON.parse(atob(user.token.split('.')[1])).role;
            localStorage.setItem('user', JSON.stringify(user));
            authActions({ type: 'LOGIN', user: user });
            return { error: false };
        } else {
            return { error: true, errorList: user.errors };
        }
    };

    const logoutHandler = () => {
        localStorage.removeItem('user');
        authActions({ type: 'LOGOUT' });
    };

    const authContext = {
        user: authState.user,
        isLoggedIn: authState.isLoggedIn,
        login: loginHandler,
        logout: logoutHandler,
        register: registerHandler,
    };

    return (
        <AuthContext.Provider value={authContext}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.element,
};

export default AuthProvider;
