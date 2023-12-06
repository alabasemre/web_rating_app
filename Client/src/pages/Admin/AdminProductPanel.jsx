/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import AdminAddProduct from './AdminAddProduct';
import AdminListProducts from './AdminListProducts';
import { getProducts } from '../../services/ProductService';

function AdminProductPanel() {
    const [products, setProducts] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [newAdded, setNewAdded] = useState(0);

    useEffect(() => {
        getProductsHandler(1, 6);
    }, []);

    const getProductsHandler = async (pageNumber, pageSize) => {
        var response = await getProducts(pageNumber, pageSize);

        if (!response.error) {
            const calculatedProducts = response.products.map((product) => {
                return calculateProduct(product);
            });

            setProducts(calculatedProducts);
            setPagination(response.pagination);
            setNewAdded(0);
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

    const addToProductList = (product) => {
        alert('Ürün Başarıyla Eklendi');
        setProducts((state) => [...state, calculateProduct(product)]);
        setNewAdded((state) => state + 1);
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

    const changePage = async (pageNumber) => {
        await getProductsHandler(pageNumber, 6);
    };

    return (
        <>
            <AdminAddProduct addToProductList={addToProductList} />
            {products.length > 0 && (
                <AdminListProducts
                    products={products}
                    pagination={pagination}
                    changePage={changePage}
                    newAdded={newAdded}
                />
            )}
        </>
    );
}

export default AdminProductPanel;
