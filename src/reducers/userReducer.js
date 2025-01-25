const initialState = {
    name: '',
    email: '',
    name: '',
    token: '',
    role: '',
    department: '',
    profile: '',
    id: '',
    isLoggedIn: false
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_USER':
            return Object.assign({}, state, {
                name: action.payload.name,
                email: action.payload.email,
                token: action.payload.token,
                role: action.payload.role,
                profile: action.payload.profile,
                department: action.payload.department,
                id: action.payload.id,
                isLoggedIn: true
            })
        case 'LOGOUT':
            localStorage.clear();
            return Object.assign({}, state, initialState);
        default:
            return state;
    }
};

export default userReducer;