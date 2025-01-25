import { Button, Container, Typography } from '@material-ui/core';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { Button, Typography, Container } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { logoutUser } from '../actions';

const Home = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const logout = () => {
    dispatch(logoutUser());
    window.location.href = '/login';
  }

  return (
    <Container>
      <Typography variant="h3" gutterBottom>
        Welcome to the Home Page
      </Typography>
      <Typography variant="h3" gutterBottom>
        User name: {user?.firstName}
      </Typography>
      <Link to="/dashboard">
        <Button variant="contained" color="primary" style={{ margin: 12 }}>
          Go to protected dashboard page
        </Button>
      </Link>
      <Link to="/about">
        <Button variant="contained" color="primary" style={{ margin: 12 }}>
          Go to About Page
        </Button>
      </Link>

      <Button variant="contained" color="secondary" onClick={logout} style={{ margin: 12 }}>
        Logout
      </Button>
    </Container>
  )
}

export default Home;
