/* eslint-disable react/prop-types */
import styles from './Pagination.module.css';

function Pagination({ pagination, changePage }) {
    const page = pagination.currentPage;
    const totalPages = pagination.totalPages;

    const changePageHandler = (pageNumber) => {
        changePage(pageNumber);
    };

    return (
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
                                className={`${styles['pagination-button']} ${
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
    );
}

export default Pagination;
