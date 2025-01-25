import React from 'react';
import { Button, Typography, Container } from '@material-ui/core';
import { Link } from 'react-router-dom';

const About = () => (
  <Container>
    <Typography variant="h3" gutterBottom>
      About Us
    </Typography>
    <Typography variant="body1" paragraph>
      This is a simple about page.
    </Typography>
    <Link to="/">
      <Button variant="contained" color="secondary">
        Back to Home
      </Button>
    </Link>
  </Container>
);

export default About;
