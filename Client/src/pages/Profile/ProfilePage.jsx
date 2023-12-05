/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useState, useEffect } from 'react';
import AuthContext from '../../store/auth-context';

import defaultImage from '../../assets/user.png';
import styles from './Profile.module.css';
import { useNavigate } from 'react-router-dom';

function ProfilePage() {
    const { user, changePhoto } = useContext(AuthContext);
    const [profilePic, setProfilePic] = useState(null);
    const [requestSending, setRequestSending] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {}, []);

    const changeProfilePic = async () => {
        if (profilePic == null) {
            return;
        }
        console.log(user);

        try {
            setRequestSending(true);
            const formData = new FormData();
            formData.append('File', profilePic);
            const resp = await fetch(
                'http://localhost:5174/api/user/add-photo',
                {
                    method: 'POST',
                    headers: {
                        Authorization: 'Bearer ' + user.token,
                    },
                    body: formData,
                }
            );

            if (resp.ok) {
                const newPhoto = await resp.json();
                changePhoto(newPhoto);
            }
        } catch (error) {
            console.log(error);
            setProfilePic(null);
        } finally {
            setRequestSending(false);
            setProfilePic(null);
        }
    };

    return (
        <>
            {requestSending || user == null ? (
                <p>Loading...</p>
            ) : (
                <section>
                    <div className={styles['welcome-container']}>
                        <p>Hoşgeldin {user.userName}</p>
                        {user.role === 'Admin' && (
                            <button
                                className={styles.button}
                                onClick={() => {
                                    navigate('/admin');
                                }}
                            >
                                Admin Paneli
                            </button>
                        )}
                    </div>
                    <div className={styles['user-info-container']}>
                        <div className={styles['user-info-left']}>
                            <div className={styles['img-container']}>
                                <img
                                    src={
                                        profilePic
                                            ? URL.createObjectURL(profilePic)
                                            : user?.photo?.url || defaultImage
                                    }
                                    alt=''
                                />
                            </div>
                            {profilePic && (
                                <>
                                    <div className={styles['confirm-buttons']}>
                                        <button
                                            disabled={requestSending}
                                            className={styles.button}
                                            onClick={changeProfilePic}
                                        >
                                            Onayla
                                        </button>
                                        <button
                                            disabled={requestSending}
                                            className={styles.button}
                                            onClick={() => {
                                                setProfilePic(null);
                                            }}
                                        >
                                            İptal
                                        </button>
                                    </div>
                                </>
                            )}

                            <input
                                type='file'
                                className={styles.button}
                                accept='image/png, image/gif, image/jpeg'
                                disabled={requestSending}
                                onChange={(e) => {
                                    setProfilePic(e.target.files[0]);
                                }}
                            ></input>
                            <div className={styles['info-container']}>
                                <p className={styles['info-header']}>
                                    E-Posta Adresi
                                </p>
                                <p className={styles['info-text']}>
                                    {user.email}
                                </p>
                            </div>
                        </div>
                        <div className={styles['user-info-right']}>
                            <div className={styles['info-container']}>
                                <p className={styles['info-header']}>
                                    Notlanan Ürün Sayısı
                                </p>
                                <p className={styles['info-text']}>
                                    <span>18</span> Ürünü Notladınız.
                                </p>
                            </div>
                            <div className={styles['info-container']}>
                                <p className={styles['info-header']}>
                                    Yorumlanan Ürün Sayısı
                                </p>
                                <p className={styles['info-text']}>
                                    <span>10</span> Ürünü Yorumladınız.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </>
    );
}

export default ProfilePage;
