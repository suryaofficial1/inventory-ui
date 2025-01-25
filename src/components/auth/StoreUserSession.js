import { setUser } from '../../actions';

export const storeUserSession = (dispatch, data) => {
    dispatch(setUser({
        isLoggedIn: true,
        id: data.id,
        name: data.name,
        role: data.role,
        department: data.department,
        email: data.email,
        profile: data.profile,
        token: data.token
    }));

    // Store user data in local storage
    localStorage.setItem('token', data.token);
    localStorage.setItem('email', data.email);
    localStorage.setItem('name', data.name);
    localStorage.setItem('role', data.role);
    localStorage.setItem('profile', data.profile);
    localStorage.setItem('department', data.department);
    localStorage.setItem('id', data.id);
};