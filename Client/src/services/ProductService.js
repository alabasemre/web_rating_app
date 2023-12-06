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

export { addProduct, getProducts };
