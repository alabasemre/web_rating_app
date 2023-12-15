/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from 'react';
import AdminAddProduct from './AdminAddProduct';
import AdminListProducts from './AdminListProducts';
import { getProducts, deleteProduct } from '../../services/ProductService';
import AuthContext from '../../store/auth-context';

function AdminProductPanel() {
    const [products, setProducts] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [newAdded, setNewAdded] = useState(0);
    const { user } = useContext(AuthContext);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const pageSize = 6;

    useEffect(() => {
        getProductsHandler(1, pageSize);
    }, []);

    const deleteProductHandler = async (productId) => {
        try {
            if (user === null) {
                return;
            }
            const isOk = await deleteProduct(productId, user.token);

            if (isOk) {
                alert('Ürün silindi.');
                const newProducts = products.filter(
                    (product) => product.id !== productId
                );
                setProducts(newProducts);
            } else {
                alert('Bir hata oluştu.');
            }
        } catch (error) {
            console.log('Error: ' + error);
        }
    };

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

    const updateProductList = (updatedProduct) => {
        alert('Ürün başarıyla güncellendi');
        const updatedProducts = products.map((product) => {
            if (product.id != updatedProduct.id) {
                return product;
            }

            return calculateProduct(updatedProduct);
        });
        setProducts(updatedProducts);
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
        setSelectedProduct(null);
        await getProductsHandler(pageNumber, pageSize);
    };

    return (
        <>
            <AdminAddProduct
                addToProductList={addToProductList}
                selectedProduct={selectedProduct}
                setSelectedProduct={setSelectedProduct}
                updateProductList={updateProductList}
            />
            {products.length > 0 && (
                <AdminListProducts
                    products={products}
                    pagination={pagination}
                    changePage={changePage}
                    newAdded={newAdded}
                    deleteProduct={deleteProductHandler}
                    setSelectedProduct={setSelectedProduct}
                />
            )}
        </>
    );
}

export default AdminProductPanel;
