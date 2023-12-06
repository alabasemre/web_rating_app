import './App.css';
import { Route, Routes } from 'react-router-dom';
import HomeLayout from './layouts/HomeLayout';
import UserLayout from './layouts/UserLayout';
import AuthLayout from './layouts/AuthLayout';
import SignupPage from './pages/AuthPages/SignupPage';
import SigninPage from './pages/AuthPages/SigninPage';
import ProfilePage from './pages/Profile/ProfilePage';
import RatedPage from './pages/Rated/RatedPage';
import NotFoundPage from './pages/NotFound/NotFoundPage';
import HomePage from './pages/Home/HomePage';
import AdminLayout from './pages/Admin/AdminLayout';
import AdminProductPanel from './pages/Admin/AdminProductPanel';

function App() {
    return (
        <>
            <Routes>
                <Route element={<HomeLayout />}>
                    <Route index element={<HomePage />} />
                    <Route element={<AuthLayout />}>
                        <Route path='/signup' element={<SignupPage />} />
                        <Route path='/signin' element={<SigninPage />} />
                    </Route>
                    <Route element={<UserLayout />}>
                        <Route path='/profile' element={<ProfilePage />} />
                        <Route path='/rated' element={<RatedPage />} />
                        <Route path='admin' element={<AdminLayout />}>
                            <Route
                                path='products'
                                element={<AdminProductPanel />}
                            />
                        </Route>
                    </Route>
                </Route>

                <Route path='*' element={<NotFoundPage />} />
            </Routes>
        </>
    );
}

export default App;
