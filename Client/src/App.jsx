import './App.css';
import { Route, Routes } from 'react-router-dom';
import HomeLayout from './layouts/HomeLayout';
import SignupPage from './pages/AuthPages/SignupPage';
import SigninPage from './pages/AuthPages/SigninPage';

function App() {
    return (
        <>
            <Routes>
                <Route element={<HomeLayout />}>
                    <Route index element={<p>Home</p>} />
                    <Route path='/signup' element={<SignupPage />} />
                    <Route path='/signin' element={<SigninPage />} />
                </Route>
            </Routes>
        </>
    );
}

export default App;
