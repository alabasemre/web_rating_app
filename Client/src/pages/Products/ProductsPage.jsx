/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';

import { getProducts } from '../../services/ProductService';
import ProductInfoCard from '../../components/ProductInfoCard/ProductInfoCard';
import Pagination from '../../components/Pagination/Pagination';

function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [pagination, setPagination] = useState(null);
    const pageSize = 10;

    useEffect(() => {
        getProductsHandler(1, pageSize);
    }, []);

    const changePage = async (pageNumber) => {
        await getProductsHandler(pageNumber, pageSize);
    };

    const getProductsHandler = async (pageNumber, pageSize) => {
        var response = await getProducts(pageNumber, pageSize);

        if (!response.error) {
            console.log(response);
            const calculatedProducts = response.products.map((product) => {
                return calculateProduct(product);
            });

            setProducts(calculatedProducts);
            setPagination(response.pagination);
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
        };
    };

    const getCommentCount = (comments) => {
        return comments?.filter((comment) => comment.text !== null).length;
    };

    const getAverageScore = (comments) => {
        return (
            comments?.reduce((acc, comment) => acc + comment.score, 0) /
                comments.length || 0
        );
    };

    return (
        <section style={{ paddingTop: 15 }}>
            {products.length > 0 && <ProductInfoCard products={products} />}
            {pagination && (
                <Pagination pagination={pagination} changePage={changePage} />
            )}
        </section>
    );
}

export default ProductsPage;
