import React, { Suspense, lazy } from 'react';
import { Loader } from 'react-overlay-loader';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';

const Login = lazy(() => import('../components/auth/Login'));
const ProtectedRoute = lazy(() => import('./ProtectedRoute'));
const LayoutIndex = lazy(() => import('../admin-panel/layout/LayoutIndex'));



const AppRouter = () => {

  return (
    <Router>
      <Suspense fallback={<><div style={{ height: "100vh" }}><Loader loading={true} className="loader" /></div></>}>
        <Switch>
          {/* <Route exact path="/" component={LayoutIndex} /> */}
          <Route path="/login" component={Login} />
          {/* <Route path="/about" component={About} /> */}
          <ProtectedRoute path="/" component={LayoutIndex} />
          {/* Add more routes as needed */}
        </Switch>
      </Suspense>
    </Router>
  )

}

export default AppRouter;