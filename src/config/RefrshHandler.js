import React, { useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

const RefreshHandler = ({ setIsAuthenticated }) => {
    const location = useLocation();
    const history = useHistory();
    const { token } = useSelector((state) => state.user.user);
    useEffect(() => {
        if (token && localStorage.getItem('token')) {
            setIsAuthenticated(true);
            if (location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/') {
                history.push('/');
            }
        }
    }, [location, history, setIsAuthenticated]);

    return null;
}

export default RefreshHandler;