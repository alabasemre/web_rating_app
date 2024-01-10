/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from 'react';
import { getUserRatedProducts } from '../../services/ProductService';
import AuthContext from '../../store/auth-context';
import styles from './RatedPage.module.css';
import { useNavigate } from 'react-router-dom';
import Pagination from '../../components/Pagination/Pagination';

function RatedPage() {
    const { user } = useContext(AuthContext);
    const [rated, setRated] = useState([]);
    const [pagination, setPagination] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        getUserRatedProductHandler();
    }, []);

    const getUserRatedProductHandler = async (
        pageNumber = 1,
        pageSize = 10
    ) => {
        const resp = await getUserRatedProducts(
            pageNumber,
            pageSize,
            user.token
        );

        if (!resp.error) {
            const calculatedProducts = resp.data.map((ratedData) =>
                calculateProduct(ratedData)
            );
            setRated(calculatedProducts);
            setPagination(resp.pagination);
        }
    };

    const calculateProduct = (ratedData) => {
        return {
            id: ratedData.product.id,
            name: ratedData.product.name,
            text: ratedData.text,
            score: ratedData.score,
            photo: ratedData.product.photo.url,
            commentCount: getCommentCount(ratedData.product.comments),
            avgScore: getAverageScore(ratedData.product.comments),
            ratedCount: ratedData.product.comments?.length,
        };
    };

    const getCommentCount = (comments) => {
        return comments?.filter(
            (comment) => comment.text !== null && comment.text !== ''
        ).length;
    };

    const getAverageScore = (comments) => {
        return (
            comments?.reduce((acc, comment) => acc + comment.score, 0) /
                comments.length || 0
        );
    };

    const changePage = async (pageNumber) => {
        await getUserRatedProductHandler(pageNumber);
    };

    return (
        <section>
            {rated.length > 0 &&
                rated.map((rated) => {
                    console.log(rated);
                    return (
                        <div
                            className={styles['rated-card-container']}
                            key={rated.id}
                            onClick={() => {
                                navigate(`/products/${rated.id}`);
                            }}
                        >
                            <p className={styles['rated-score']}>
                                {rated.score}
                            </p>
                            <div className={styles['rated-card-left']}>
                                <div className={styles['rated-card-img']}>
                                    <img src={rated.photo} alt='' />
                                </div>
                                <div className={styles['rated-card-info']}>
                                    <h3 className={styles['rated-card-title']}>
                                        {rated.name}
                                    </h3>
                                    <p className={styles['rated-card-text']}>
                                        <span>{rated.ratedCount} </span>
                                        Defa Notlandı
                                    </p>
                                    <p className={styles['rated-card-text']}>
                                        <span>{rated.commentCount} </span>
                                        Defa Yorumlandı
                                    </p>
                                    <p className={styles['rated-card-text']}>
                                        <span>{rated.avgScore} </span>
                                        Not Ortalamasına Sahip
                                    </p>
                                </div>
                            </div>
                            <div className={styles['rated-card-right']}>
                                <p className={styles['rated-card-bold-text']}>
                                    Yorumunuz:
                                </p>
                                <p className={styles['rated-card-comment']}>
                                    {rated.text
                                        ? rated.text
                                        : 'Bu ürün için bir yorumunuz bulunmuyor...'}
                                </p>
                            </div>
                        </div>
                    );
                })}
            {pagination && (
                <Pagination pagination={pagination} changePage={changePage} />
            )}
        </section>
    );
}

export default RatedPage;
