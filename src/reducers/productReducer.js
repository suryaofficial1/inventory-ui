const initialProductState = {
    products: [],
    loading: false,
};

const productReducer = (state = initialProductState, action) => {
    switch (action.type) {
        case 'SET_PRODUCTS':
            return { ...state, products: action.payload, loading: false };
        case 'SET_LOADING':
            return { ...state, loading: true };
        default:
            return state;
    }
};

export default productReducer;