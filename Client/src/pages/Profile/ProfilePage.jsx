/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from 'react';
import AuthContext from '../../store/auth-context';

import defaultImage from '../../assets/user.png';
import styles from './Profile.module.css';

import { changeProfilePicture, getUserStats } from '../../services/UserService';

function ProfilePage() {
    const { user, changePhoto } = useContext(AuthContext);
    const [profilePic, setProfilePic] = useState(null);
    const [requestSending, setRequestSending] = useState(false);
    const [userStats, setUserStats] = useState(null);

    useEffect(() => {
        getUserStatsHandler();
    }, []);

    const getUserStatsHandler = async () => {
        const stats = await getUserStats(user.token);
        if (!stats.error) {
            setUserStats(stats.data);
        }
    };

    const changeImageHandler = async () => {
        if (profilePic == null) {
            return;
        }

        try {
            setRequestSending(true);
            const formData = new FormData();
            formData.append('File', profilePic);
            const resp = await changeProfilePicture(formData, user.token);

            if (!resp?.error) {
                changePhoto(resp.photo);
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
                                            onClick={changeImageHandler}
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
                                    <span>{userStats?.ratedCount}</span> Ürünü
                                    Notladınız.
                                </p>
                            </div>
                            <div className={styles['info-container']}>
                                <p className={styles['info-header']}>
                                    Yorumlanan Ürün Sayısı
                                </p>
                                <p className={styles['info-text']}>
                                    <span>{userStats?.commentCount}</span> Ürünü
                                    Yorumladınız.
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
