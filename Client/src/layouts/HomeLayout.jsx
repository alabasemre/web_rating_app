import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';

function HomeLayout() {
    return (
        <>
            <Navbar />
            <main style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <Outlet />
            </main>
        </>
    );
}

export default HomeLayout;
