import { Link } from 'react-router-dom';
import styles from './AuthPages.module.css';
import TextInput from '../../components/ui/TextInput/TextInput';
import { useContext, useState } from 'react';
import AuthContext from '../../store/auth-context';

function SigninPage() {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const authContext = useContext(AuthContext);

    const handleLogin = async (e) => {
        e.preventDefault();
        await authContext.login(userName, password);
    };

    return (
        <div className={styles['form-container']}>
            <p className={styles['form-text']}>
                Giriş Yap <br />
                ve <br /> notlamaya başla
            </p>

            <form className={styles.form} onSubmit={handleLogin}>
                <TextInput
                    id='username'
                    label='Kullanıcı Adı'
                    name='username'
                    type='text'
                    onChange={setUserName}
                    value={userName}
                />
                <TextInput
                    id='password'
                    label='Şifre'
                    name='password'
                    type='password'
                    onChange={setPassword}
                    value={password}
                />

                <button className={styles['input-button']}>Giriş Yap</button>
            </form>

            <p className={styles['signin-text']}>
                Hesabın yok mu? <Link to='/signup'>Kayıt Ol</Link>
            </p>
        </div>
    );
}

export default SigninPage;
