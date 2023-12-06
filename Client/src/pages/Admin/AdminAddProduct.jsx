/* eslint-disable react/prop-types */
import { useContext, useState } from 'react';
import defaultImage from '../../assets/empty.png';
import styles from './Admin.module.css';
import AuthContext from '../../store/auth-context';
import { addProduct } from '../../services/ProductService';

function AdminAddProduct({ addToProductList }) {
    const { user } = useContext(AuthContext);
    const [requestSending, setRequestSending] = useState(false);
    const [productImage, setProductImage] = useState(null);
    const [productName, setProductName] = useState('');
    const [productDescription, setProductDescription] = useState('');

    const addProductHandler = async (e) => {
        e.preventDefault();
        if (
            productImage === null ||
            productName === '' ||
            productDescription === ''
        ) {
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
                setProductName('');
                setProductImage(null);
                setProductDescription('');
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

    return (
        <div className={styles['add-product-container']}>
            <p></p>
            <div className={styles['img-container']}>
                <img
                    src={
                        productImage === null
                            ? defaultImage
                            : URL.createObjectURL(productImage)
                    }
                    alt=''
                />
                {productImage ? '' : <p>Ürün Resmi Seçin</p>}
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
                    onSubmit={addProductHandler}
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
                    <button
                        disabled={requestSending}
                        className={`${styles['button']} ${styles['btn-add']}`}
                    >
                        Ürünü Ekle
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AdminAddProduct;
