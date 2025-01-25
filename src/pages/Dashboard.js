import { Button, Link } from '@material-ui/core';
import React from 'react'

const Dashboard = () => {
    const user = useSelector((state) => state.user);

  return (
    <div>
      <h1>This is Dashboard page</h1>
      <div>
        <p>User name: {user?.firstName}</p>
      </div>
      <Link to="/">
      <Button variant="contained" color="secondary">
        Back to Home
      </Button>
    </Link>
    </div>
  )
}

export default Dashboard
