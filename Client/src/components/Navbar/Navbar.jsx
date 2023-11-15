import { NavLink } from 'react-router-dom';
import styles from './Navbar.module.css';

function Navbar() {
    return (
        <nav>
            <div className={styles['nav-container']}>
                <NavLink to='/' className={styles['nav-link']}>
                    Anasayfa
                </NavLink>
                <div className={styles['auth-container']}>
                    <NavLink to='/signup' className={styles['nav-link']}>
                        Kayıt Ol
                    </NavLink>
                    <NavLink to='/signin' className={styles['nav-link']}>
                        Giriş Yap
                    </NavLink>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
