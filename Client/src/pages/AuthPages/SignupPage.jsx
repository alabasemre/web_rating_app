import { Link } from 'react-router-dom';
import styles from './AuthPages.module.css';
import TextInput from '../../components/ui/TextInput/TextInput';
import { useContext, useState } from 'react';
import AuthContext from '../../store/auth-context';

function SignupPage() {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState(null);

    const authContext = useContext(AuthContext);

    const handleRegister = async (e) => {
        e.preventDefault();

        const response = await authContext.register(userName, email, password);

        if (response.error) {
            setErrors(response.errorList);
        } else if (errors) {
            setErrors(null);
        }
    };

    return (
        <div className={styles['form-container']}>
            <p className={styles['form-text']}>
                Kayıt ol <br />
                ve <br /> notlamaya başla
            </p>

            <form className={styles.form} onSubmit={handleRegister}>
                <TextInput
                    id='username'
                    label='Kullanıcı Adı'
                    name='username'
                    type='text'
                    onChange={setUserName}
                    value={userName}
                />
                {errors?.['UserName']?.[0] ? (
                    <p>{errors['UserName']?.[0]}</p>
                ) : null}
                <TextInput
                    id='email'
                    label='E-Posta Adresi'
                    name='email'
                    type='email'
                    onChange={setEmail}
                    value={email}
                />
                {errors?.['Email']?.[0] ? <p>{errors['Email']?.[0]}</p> : null}
                <TextInput
                    id='password'
                    label='Şifre'
                    name='password'
                    type='password'
                    onChange={setPassword}
                    value={password}
                />
                {errors?.['Password']?.[0] ? (
                    <p>{errors['Password']?.[0]}</p>
                ) : null}

                <button className={styles['input-button']}>Kayıt Ol</button>
            </form>

            <p className={styles['signin-text']}>
                Hesabın var mı? <Link to='/signin'>Giriş yap</Link>
            </p>
        </div>
    );
}

export default SignupPage;
