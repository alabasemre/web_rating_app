import { NavLink } from 'react-router-dom';
import styles from './Navbar.module.css';
import { useContext } from 'react';
import AuthContext from '../../store/auth-context';

function Navbar() {
    const authContext = useContext(AuthContext);
    return (
        <nav>
            <div className={styles['nav-container']}>
                <div className={styles['nav-menus']}>
                    <NavLink to='/' className={styles['nav-link']}>
                        Anasayfa
                    </NavLink>
                    <NavLink to='/products' className={styles['nav-link']}>
                        Ürünler
                    </NavLink>
                    {authContext.isLoggedIn && (
                        <NavLink to='/rated' className={styles['nav-link']}>
                            Notladım
                        </NavLink>
                    )}
                    {authContext.isLoggedIn &&
                        authContext.user.role === 'Admin' && (
                            <NavLink
                                to='/admin/products'
                                className={styles['nav-link']}
                            >
                                Ürün Paneli
                            </NavLink>
                        )}
                </div>

                {authContext.isLoggedIn ? (
                    <div className={styles['auth-container']}>
                        <NavLink to='/profile' className={styles['nav-link']}>
                            Profil
                        </NavLink>
                        <NavLink
                            to='/signin'
                            className={styles['nav-link']}
                            onClick={async () => {
                                await authContext.logout();
                            }}
                        >
                            Çıkış Yap
                        </NavLink>
                    </div>
                ) : (
                    <div className={styles['auth-container']}>
                        <NavLink to='/signup' className={styles['nav-link']}>
                            Kayıt Ol
                        </NavLink>
                        <NavLink to='/signin' className={styles['nav-link']}>
                            Giriş Yap
                        </NavLink>
                    </div>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
