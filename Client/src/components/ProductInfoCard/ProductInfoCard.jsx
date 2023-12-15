/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */

import { useNavigate } from 'react-router-dom';
import styles from './ProductInfoCard.module.css';

function ProductInfoCard({ products }) {
    const navigate = useNavigate();

    const goToDetail = (productId) => {
        navigate(`/products/${productId}`);
    };

    return (
        <div className={styles['products-container']}>
            {products.map((product) => {
                return (
                    <div
                        className={styles['product-card-container']}
                        key={product.id}
                        onClick={() => {
                            goToDetail(product.id);
                        }}
                    >
                        <div className={styles['product-card-img-container']}>
                            <img
                                src={product.photo.url}
                                alt=''
                                className={styles['product-card-img']}
                            />
                        </div>
                        <div className={styles['product-ratings']}>
                            <h3 className={styles['product-title']}>
                                {product.name}
                            </h3>
                            <p className={styles['product-rating']}>
                                <span>{product.ratedCount}</span> Defa Notlandı
                            </p>
                            <p className={styles['product-rating']}>
                                <span>{product.avgScore}</span> Ortalama Nota
                                Sahip
                            </p>
                            <p className={styles['product-rating']}>
                                <span>{product.commentCount} </span>
                                Defa Yorumlandı
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default ProductInfoCard;
