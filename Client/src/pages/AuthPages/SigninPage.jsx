import { Link } from 'react-router-dom';
import styles from './AuthPages.module.css';
import TextInput from '../../components/ui/TextInput/TextInput';

function SigninPage() {
    return (
        <div className={styles['form-container']}>
            <p className={styles['form-text']}>
                Giriş Yap <br />
                ve <br /> notlamaya başla
            </p>

            <form className={styles.form}>
                <TextInput
                    id='username'
                    label='Kullanıcı Adı'
                    name='username'
                />
                <TextInput id='password' label='Şifre' name='password' />

                <button className={styles['input-button']}>Giriş Yap</button>
            </form>

            <p className={styles['signin-text']}>
                Hesabın yok mu? <Link to='/signup'>Kayıt Ol</Link>
            </p>
        </div>
    );
}

export default SigninPage;
