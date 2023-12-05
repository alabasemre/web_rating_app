import { useContext } from 'react';
import AuthContext from '../store/auth-context';
import { Navigate, Outlet } from 'react-router-dom';

function UserLayout() {
    const { isLoggedIn } = useContext(AuthContext);
    return <>{isLoggedIn ? <Outlet /> : <Navigate to='/' />}</>;
}

export default UserLayout;
