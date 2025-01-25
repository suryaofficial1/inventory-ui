export const setUser = (data) => ({
    type: 'SET_USER',
    payload: data,
});
export const logoutUser = (data) => ({
    type: 'LOGOUT'
});

export const setLoading = () => ({
    type: 'SET_LOADING',
});

export const setProducts = (products) => ({
    type: 'SET_PRODUCTS',
    payload: products,
});