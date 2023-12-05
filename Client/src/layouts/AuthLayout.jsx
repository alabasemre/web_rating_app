import { useContext } from 'react';
import AuthContext from '../store/auth-context';
import { Navigate, Outlet } from 'react-router-dom';

function AuthLayout() {
    const { isLoggedIn, user } = useContext(AuthContext);
    return (
        <>{isLoggedIn || user !== null ? <Navigate to='/' /> : <Outlet />}</>
    );
}

export default AuthLayout;
