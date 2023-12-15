import { useParams } from 'react-router-dom';
import styles from './Products.module.css';
import { useContext, useEffect, useState } from 'react';
import { getProduct } from '../../services/ProductService';
import defaultImg from '../../assets/user.png';
import AuthContext from '../../store/auth-context';
import { addComment } from '../../services/CommentService';

function ProductDetailPage() {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const { user } = useContext(AuthContext);
    const [score, setScore] = useState(0);
    const [comment, setComment] = useState('');
    const [isScoreExists, setIsScoreExists] = useState(false);
    const [isRequesting, setIsRequesting] = useState(false);
    const [isCommentedBefore, setIsCommentedBefore] = useState(false);

    useEffect(() => {
        getProductDetail();
    }, []);

    const getProductDetail = async () => {
        const productResp = await getProduct(productId);

        if (!productResp.error) {
            const calculatedProduct = calculateProduct(productResp.product);
            setProduct(calculatedProduct);
            isRated(productResp.product.comments);
        }
    };

    const addCommentHandler = async (e) => {
        e.preventDefault();

        if (score == 0) {
            setIsScoreExists(true);
            return;
        }

        try {
            setIsRequesting(true);
            const resp = await addComment(
                {
                    productid: productId,
                    score: score,
                    commenttext: comment,
                },
                user.token
            );
            if (!resp) {
                return;
            }

            if (isCommentedBefore) {
                const updatedComments = product.comments.map((comment) => {
                    if (comment.id === resp.id) {
                        return resp;
                    }

                    return comment;
                });

                const newProduct = calculateProduct({
                    ...product,
                    comments: updatedComments,
                });

                setProduct(newProduct);
            } else {
                console.log('Add new comment:', resp);
                const newProduct = calculateProduct({
                    ...product,
                    comments: [...product.comments, resp],
                });

                setProduct(newProduct);
                setIsCommentedBefore(true);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsRequesting(false);
        }
    };

    const calculateProduct = (product) => {
        return {
            id: product.id,
            name: product.name,
            description: product.description,
            photo: product.photo,
            commentCount: getCommentCount(product.comments),
            avgScore: getAverageScore(product.comments),
            ratedCount: product.comments?.length,
            comments: product.comments,
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

    const isRated = (comments) => {
        const rated = comments.find((comment) => {
            return comment.userName == user.userName;
        });

        if (rated) {
            setScore(rated.score);
            setComment(rated.text);
            setIsCommentedBefore(true);
        }
    };

    return (
        <>
            {product === null ? (
                <div>Loading...</div>
            ) : (
                <section>
                    <div className={styles['product-card-container']}>
                        <div className={styles['product-img-container']}>
                            <img src={product.photo.url} alt='' />
                        </div>
                        <div className={styles['product-rating-container']}>
                            <h1 className={styles['product-name']}>
                                {product.name}
                            </h1>
                            <p className={styles['product-rating']}>
                                <span>{product.ratedCount}</span> Defa Notlandı
                            </p>
                            <p className={styles['product-rating']}>
                                <span>{product.commentCount}</span> Defa
                                Yorumlandı
                            </p>
                            <p className={styles['product-rating']}>
                                <span>{product.avgScore}</span> Not Ortalamasına
                                Sahip
                            </p>
                        </div>
                    </div>
                    <div className={styles['comment-detail-container']}>
                        <div className={styles['product-details-container']}>
                            <h3 className={styles['section-title']}>
                                Ürün Detayı
                            </h3>
                            <div className={styles['white-container']}>
                                <p>{product.description}</p>
                            </div>
                        </div>
                        <div className={styles['product-comments-container']}>
                            <h3 className={styles['section-title']}>
                                Ürün Yorumları
                            </h3>
                            <div className={styles['white-container']}>
                                {product.comments.map((comment) => (
                                    <div
                                        key={comment.id}
                                        className={
                                            styles['comment-card-container']
                                        }
                                    >
                                        <p className={styles['comment-score']}>
                                            {comment.score}
                                        </p>
                                        <div
                                            className={
                                                styles['comment-user-container']
                                            }
                                        >
                                            <div
                                                className={
                                                    styles['comment-user-img']
                                                }
                                            >
                                                <img
                                                    src={
                                                        comment.imgUrl ||
                                                        defaultImg
                                                    }
                                                    alt=''
                                                />
                                            </div>
                                            <p
                                                className={
                                                    styles['comment-username']
                                                }
                                            >
                                                {comment.userName}
                                            </p>
                                        </div>
                                        <p className={styles['comment-text']}>
                                            {comment.text}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    {user && (
                        <>
                            <div className={styles['product-rating-buttons']}>
                                <h3 className={styles['section-title']}>
                                    Yorumunuz
                                </h3>
                                <div>
                                    {[...Array(5)].map((x, i) => {
                                        return (
                                            <button
                                                key={i}
                                                disabled={isRequesting}
                                                onClick={() => {
                                                    setIsScoreExists(false);
                                                    setScore(i + 1);
                                                }}
                                                className={`${
                                                    styles[
                                                        'product-rating-button'
                                                    ]
                                                } ${
                                                    score === i + 1
                                                        ? styles['active']
                                                        : ''
                                                } `}
                                            >
                                                {i + 1}
                                            </button>
                                        );
                                    })}
                                    {isScoreExists && (
                                        <p>
                                            Yorum yapmak için önce ürünü
                                            notlamalısınız.
                                        </p>
                                    )}
                                </div>
                            </div>

                            <form
                                className={styles['form-container']}
                                onSubmit={addCommentHandler}
                            >
                                <textarea
                                    name=''
                                    id=''
                                    className={styles['form-text']}
                                    value={comment}
                                    onChange={(e) => {
                                        setComment(e.target.value);
                                    }}
                                ></textarea>
                                <button
                                    className={styles['form-button']}
                                    disabled={isRequesting}
                                >
                                    Yorum Ekle
                                </button>
                            </form>
                        </>
                    )}
                </section>
            )}
        </>
    );
}

export default ProductDetailPage;
