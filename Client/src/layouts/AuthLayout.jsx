import { useContext } from 'react';
import AuthContext from '../store/auth-context';
import { Navigate, Outlet } from 'react-router-dom';

function AuthLayout() {
    const { isLoggedIn } = useContext(AuthContext);
    return <>{isLoggedIn ? <Navigate to='/' /> : <Outlet />}</>;
}

export default AuthLayout;
