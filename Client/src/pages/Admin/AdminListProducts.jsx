/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from 'react';
import styles from './Admin.module.css';
import { MdModeEdit, MdDelete } from 'react-icons/md';

function AdminListProducts({
    products,
    pagination,
    changePage,
    newAdded,
    deleteProduct,
    setSelectedProduct,
}) {
    const page = pagination.currentPage;
    const totalPages = pagination.totalPages;
    const [isLoading, setIsLoading] = useState(false);
    const changePageHandler = (pageNumber) => {
        changePage(pageNumber);
    };

    return (
        <div className={styles['products-container']}>
            <p>
                Sistemde {pagination?.totalItems + newAdded} adet ürün
                bulunuyor.
            </p>
            {products.map((product) => {
                return (
                    <div
                        className={styles['product-card-container']}
                        key={product.id}
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
                                <span>{product.ratedCount} </span>
                                Notlanma
                            </p>
                            <p className={styles['product-rating']}>
                                <span>{product.avgScore}</span> Not
                            </p>
                            <p className={styles['product-rating']}>
                                <span>{product.commentCount} </span>
                                Yorum
                            </p>
                        </div>
                        <div className={styles['action-buttons']}>
                            <button
                                className={styles['btn-action']}
                                disabled={isLoading}
                                onClick={() => {
                                    setSelectedProduct(product);
                                }}
                            >
                                <MdModeEdit />
                            </button>
                            <button
                                className={styles['btn-action']}
                                disabled={isLoading}
                                onClick={async () => {
                                    setIsLoading(true);
                                    await deleteProduct(product.id);
                                    setIsLoading(false);
                                }}
                            >
                                <MdDelete />
                            </button>
                        </div>
                    </div>
                );
            })}
            <div className={styles['pagination-buttons']}>
                <button
                    className={`${styles['pagination-button']} ${
                        page === 1 ? styles.active : ''
                    } `}
                    onClick={() => {
                        changePageHandler(1);
                    }}
                >
                    1
                </button>

                {[...Array(totalPages + 1)].map((x, i) => {
                    let pageCalc;
                    let diff = 2;

                    if (page + 2 === totalPages && page !== 1) {
                        pageCalc = page - 1 + i;
                    } else if (page + 1 === totalPages) {
                        pageCalc = page - 2 + i;
                        diff = 3;
                    } else if (page === totalPages) {
                        pageCalc = page - 4 + i;
                        diff = 4;
                    } else if (page === 2) {
                        pageCalc = page + i;
                        diff = 3;
                    } else if (page === 1) {
                        pageCalc = page + i;

                        diff = 4;
                    } else {
                        pageCalc = page + i - 1;
                    }

                    if (pageCalc < totalPages && pageCalc > 1) {
                        if (pageCalc > page - diff && pageCalc < page + diff) {
                            return (
                                <button
                                    className={`${
                                        styles['pagination-button']
                                    } ${
                                        page === pageCalc ? styles.active : ''
                                    } `}
                                    key={i}
                                    onClick={() => {
                                        changePageHandler(pageCalc);
                                    }}
                                >
                                    {pageCalc}
                                </button>
                            );
                        }
                    }
                })}
                {totalPages > 1 && (
                    <button
                        className={`${styles['pagination-button']} ${
                            page === totalPages ? styles.active : ''
                        } `}
                        onClick={() => {
                            changePageHandler(totalPages);
                        }}
                    >
                        {totalPages}
                    </button>
                )}
            </div>
        </div>
    );
}

export default AdminListProducts;
