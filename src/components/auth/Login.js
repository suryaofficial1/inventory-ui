import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { LOGIN } from '../../config/api-urls';
import { useLoader } from '../../hooks/useLoader';
import { showMessage } from '../../utils/message';
import { sendPostRequest } from '../../utils/network';
import { storeUserSession } from './StoreUserSession';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const dispatch = useDispatch();
  const [{ start, stop }, Loader] = useLoader();


  const validation = () => {
    const error = {};
    if (!email) {
      error.email = 'Email is required';
    }
    if (!password) {
      error.password = 'Password is required';
    }
    if (Object.keys(error).length > 0) {
      setErrorMessage(error);
    } else {
      setErrorMessage('');
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validation()) return;
    const reqData = {
      email: email,
      password: password
    }
    start()
    sendPostRequest(LOGIN, reqData).then((res) => {
      if (res.status === 200) {
        storeUserSession(dispatch, res.data);
        showMessage('success', 'Login successfully');
        setTimeout(() => {
          window.location.href = '/#dashboard';
        }, 500);
      } else if (res.status === 400) {
        showMessage('error', res.data);
      } else {
        showMessage('error', "Something went wrong in login!");
      }
    }).catch((err) => {
      console.log(err);
      showMessage('error', "Something went wrong in login!");
    }).finally(() => stop())
  };

  return (
    <>
      <Loader />
      <div className="login-container">
        <div className="login-logo">
          <img src="/images/login-logo-3.png" alt="Kanban Logo" />
        </div>
        <div className="login-form">
          <div className="login-mini-logo">
            <img src="/images/mini-logo.png" alt="Mini Logo" />
          </div>
          <h1>Log in to your account</h1>
          <p>Welcome back! Please enter your details</p>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errorMessage.email && <span className="error">{errorMessage.email}</span>}
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errorMessage.password && <span className="error">{errorMessage.password}</span>}
            </div>
            <div className="form-options">
              <label>
                <input type="checkbox" /> Remember me
              </label>
            </div>
            <button type="submit" className="btn-primary">
              Sign in
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
