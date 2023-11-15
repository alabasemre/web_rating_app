import { Link } from 'react-router-dom';
import styles from './AuthPages.module.css';
import TextInput from '../../components/ui/TextInput/TextInput';

function SignupPage() {
    return (
        <div className={styles['form-container']}>
            <p className={styles['form-text']}>
                Kayıt ol <br />
                ve <br /> notlamaya başla
            </p>

            <form className={styles.form}>
                <TextInput
                    id='username'
                    label='Kullanıcı Adı'
                    name='username'
                />
                <TextInput id='email' label='E-Posta Adresi' name='email' />
                <TextInput id='password' label='Şifre' name='password' />

                <button className={styles['input-button']}>Kayıt Ol</button>
            </form>

            <p className={styles['signin-text']}>
                Hesabın var mı? <Link to='/signin'>Giriş yap</Link>
            </p>
        </div>
    );
}

export default SignupPage;
