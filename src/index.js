


import React from 'react';
import ReactDOM from 'react-dom/client'; // Use this for React 18+
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import store from './redux/store';
import { SnackbarProvider } from 'notistack';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';

const root = ReactDOM.createRoot(document.getElementById('root')); // Updated for React 18

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <SnackbarProvider maxSnack={3}> {/* Optional: Customize Snackbar */}
          <App />
        </SnackbarProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
