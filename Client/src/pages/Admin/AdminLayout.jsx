import { useContext } from 'react';
import AuthContext from '../../store/auth-context';
import { Navigate, Outlet } from 'react-router-dom';

function AdminLayout() {
    const { user, isLoggedIn } = useContext(AuthContext);

    return (
        <>
            {!isLoggedIn || user.role !== 'Admin' ? (
                <Navigate to='/' />
            ) : (
                <Outlet />
            )}
        </>
    );
}

export default AdminLayout;
