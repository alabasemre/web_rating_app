/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from 'react';
import defaultImage from '../../assets/empty.png';
import styles from './Admin.module.css';
import AuthContext from '../../store/auth-context';
import { addProduct, updateProduct } from '../../services/ProductService';

function AdminAddProduct({
    addToProductList,
    selectedProduct,
    setSelectedProduct,
    updateProductList,
}) {
    const { user } = useContext(AuthContext);
    const [requestSending, setRequestSending] = useState(false);
    const [productImage, setProductImage] = useState(null);
    const [productName, setProductName] = useState('');
    const [productDescription, setProductDescription] = useState('');

    useEffect(() => {
        if (selectedProduct) {
            setProductName(selectedProduct.name);
            setProductDescription(selectedProduct.description);
        } else {
            setProductName('');
            setProductDescription('');
        }
    }, [selectedProduct]);

    const onSubmitHandler = (e) => {
        e.preventDefault();

        try {
            if (selectedProduct) {
                updateProductHandler();
            } else {
                addProductHandler();
            }
        } catch (error) {
            console.log(error);
        }
    };

    const updateProductHandler = async () => {
        if (productName === '' || productDescription === '') {
            alert('Boş alanları doldurdun...');
            return;
        }

        try {
            setRequestSending(true);
            const formData = new FormData();

            formData.append('Image', productImage);
            formData.append('Name', productName);
            formData.append('Description', productDescription);
            const resp = await updateProduct(
                selectedProduct.id,
                formData,
                user.token
            );
            if (!resp.error) {
                clear();
                updateProductList(resp.data);
            } else {
                alert('Bir şeyler ters gitti');
            }
        } catch (error) {
            console.log(error);
        } finally {
            setRequestSending(false);
        }
    };

    const addProductHandler = async () => {
        if (
            productImage === null ||
            productName === '' ||
            productDescription === ''
        ) {
            alert('Tüm alanları doldurun...');
            return;
        }

        try {
            setRequestSending(true);
            const formData = new FormData();
            formData.append('Image', productImage);
            formData.append('Name', productName);
            formData.append('Description', productDescription);

            const resp = await addProduct(formData, user.token);

            if (resp) {
                clear();
                addToProductList(resp);
            } else {
                alert('Bir şeyler ters gitti');
            }
        } catch (error) {
            console.log(error);
        } finally {
            setRequestSending(false);
        }
    };

    const clear = () => {
        setSelectedProduct(null);
        setProductName('');
        setProductDescription('');
        setProductImage(null);
    };

    return (
        <div className={styles['add-product-container']}>
            <div className={styles['img-container']}>
                <img
                    src={
                        productImage === null
                            ? selectedProduct
                                ? selectedProduct.photo.url
                                : defaultImage
                            : URL.createObjectURL(productImage)
                    }
                    alt=''
                />
                {selectedProduct || productImage ? '' : <p>Ürün Resmi Seçin</p>}
                <input
                    type='file'
                    className={styles.button}
                    accept='image/png, image/gif, image/jpeg'
                    disabled={requestSending}
                    onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                            setProductImage(e.target.files[0]);
                        } else {
                            setProductImage(null);
                            e.target.value = null;
                        }
                    }}
                ></input>
            </div>
            <div className={styles['product-form-container']}>
                <form
                    className={styles['product-form']}
                    onSubmit={onSubmitHandler}
                >
                    <div className={styles['form-group']}>
                        <label htmlFor='productName'>Ürün Adı</label>
                        <input
                            type='text'
                            name='productName'
                            value={productName}
                            onChange={(e) => {
                                setProductName(e.target.value);
                            }}
                        />
                    </div>
                    <div className={styles['form-group']}>
                        <label htmlFor='productDescription'>
                            Ürün Açıklaması
                        </label>
                        <textarea
                            name='productDescription'
                            id='productDescription'
                            value={productDescription}
                            onChange={(e) => {
                                setProductDescription(e.target.value);
                            }}
                        ></textarea>
                    </div>
                    {selectedProduct ? (
                        <div className={styles['update-buttons']}>
                            <button
                                className={`${styles['button']} ${styles['btn-add']}`}
                                onClick={clear}
                                disabled={requestSending}
                            >
                                Temizle
                            </button>
                            <button
                                disabled={requestSending}
                                className={`${styles['button']} ${styles['btn-add']}`}
                            >
                                Ürünü Güncelle
                            </button>
                        </div>
                    ) : (
                        <button
                            disabled={requestSending}
                            className={`${styles['button']} ${styles['btn-add']}`}
                        >
                            Ürünü Ekle
                        </button>
                    )}
                </form>
            </div>
        </div>
    );
}

export default AdminAddProduct;
