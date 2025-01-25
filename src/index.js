
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import StylesProvider from "@material-ui/styles/StylesProvider";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import globalTheme from "./screen/theme/globalTheme";
import { generateClassId } from "./utils/jssClassNameGenerator";
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './store/store';

const rootElement = document.getElementById("root");

const app = <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
            <StylesProvider generateClassName={generateClassId}>
                <MuiThemeProvider theme={globalTheme}>
                    <App />
                </MuiThemeProvider>
            </StylesProvider>
        </BrowserRouter>
    </PersistGate>
</Provider>
if (rootElement.hasChildNodes()) {
    ReactDOM.hydrate(app, rootElement);
} else {
    ReactDOM.render(app, rootElement);
}


