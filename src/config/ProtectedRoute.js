import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';

const ProtectedRoute = ({ component: Component, ...props }) => {
  const user = useSelector((state) => state.user);

  return (
    <Route
      {...props}
      render={routeProps => (
        user.isLoggedIn ?
          <Component {...routeProps} />
          :
          <Redirect to='/login' />
      )}
    />
  )
}

export default ProtectedRoute
