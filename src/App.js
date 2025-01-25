

import { SnackbarProvider } from 'notistack';
import React from 'react';
import { Loader } from 'react-overlay-loader';

import 'react-overlay-loader/styles.css';
import './App.css';
import withErrorHandler from "./components/error-handler/withErrorHandler.js";
import Router from './config/router.js';
import InitSnackbar from './utils/message';

const App = () => {


    return (
        <>
            <Loader fullPage />
            <SnackbarProvider
                maxSnack={3}
                autoHideDuration={4000}
                preventDuplicate
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                <InitSnackbar />
                <Router />
            </SnackbarProvider>
        </>
    );
};


export default withErrorHandler(App);
