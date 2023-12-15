const BASE_URL = 'http://localhost:5174/api/products';

async function addProduct(formData, token) {
    try {
        const resp = await fetch(`${BASE_URL}/add`, {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + token,
            },
            body: formData,
        });

        if (resp.ok) {
            return await resp.json();
        } else {
            return false;
        }
    } catch (error) {
        console.log(error);
    }
}

async function getProducts(pageNumber, pageSize) {
    var params = '';

    if (pageNumber !== undefined && pageSize !== undefined) {
        params = new URLSearchParams();
        params.append('pageNumber', pageNumber);
        params.append('pageSize', pageSize);
    }

    try {
        var resp = await fetch(`${BASE_URL}?${params.toString()}`, {
            method: 'GET',
        });

        if (resp.ok) {
            const products = await resp.json();
            return {
                error: false,
                products: products,
                pagination: JSON.parse(resp.headers.get('Pagination')),
            };
        }
    } catch (error) {
        console.log(error);
    }
}

async function getUserRatedProducts(pageNumber, pageSize, token) {
    var params = '';

    if (pageNumber !== undefined && pageSize !== undefined) {
        params = new URLSearchParams();
        params.append('pageNumber', pageNumber);
        params.append('pageSize', pageSize);
    }

    try {
        var resp = await fetch(`${BASE_URL}/user-rated?${params.toString()}`, {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + token,
            },
        });

        if (resp.ok) {
            const products = await resp.json();
            return {
                error: false,
                data: products,
                pagination: JSON.parse(resp.headers.get('Pagination')),
            };
        }
    } catch (error) {
        console.log(error);
    }
}

async function getProduct(productId) {
    try {
        var resp = await fetch(`${BASE_URL}/${productId}`, {
            method: 'GET',
        });

        if (resp.ok) {
            const product = await resp.json();
            return {
                error: false,
                product: product,
            };
        }
    } catch (error) {
        console.log(error);
    }
}

async function deleteProduct(productId, token) {
    try {
        const resp = await fetch(`${BASE_URL}/${productId}`, {
            method: 'DELETE',
            headers: {
                Authorization: 'Bearer ' + token,
            },
        });

        if (resp.ok) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.log(error);
    }
}

async function updateProduct(productId, formData, token) {
    try {
        const resp = await fetch(`${BASE_URL}/${productId}`, {
            method: 'PUT',
            headers: {
                Authorization: 'Bearer ' + token,
            },
            body: formData,
        });

        if (resp.ok) {
            const data = await resp.json();
            return await { error: false, data: data };
        } else {
            const data = await resp.json();
            return { error: true, message: data };
        }
    } catch (error) {
        console.log(error);
    }
}

export {
    addProduct,
    getProduct,
    getProducts,
    deleteProduct,
    updateProduct,
    getUserRatedProducts,
};
