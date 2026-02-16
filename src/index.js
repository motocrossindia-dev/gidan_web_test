// ========== OLD CODE (Before Feb 16, 2026) - COMMENTED OUT ==========
// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import { BrowserRouter } from 'react-router-dom';
// import './index.css';
// import App from './App';
// import { Provider } from 'react-redux';
// import store from './redux/store';
// import { SnackbarProvider } from 'notistack';
// import 'core-js/stable';
// import 'regenerator-runtime/runtime';
// import 'react-app-polyfill/ie11';
// import 'react-app-polyfill/stable';
// import { HelmetProvider } from "react-helmet-async";
// 
// const root = ReactDOM.createRoot(document.getElementById('root'));
// 
// root.render(
//   <React.StrictMode>
//    <HelmetProvider>
//     <Provider store={store}>
//       <BrowserRouter>
//         <SnackbarProvider maxSnack={3}>
//           <App />
//         </SnackbarProvider>
//       </BrowserRouter>
//     </Provider>
//     </HelmetProvider>
//   </React.StrictMode>
// );
// ========== END OLD CODE ==========

// ========== NEW CODE (Feb 16, 2026) - Added TanStack Query Provider ==========
import React from 'react';
import ReactDOM from 'react-dom/client';
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
import { HelmetProvider } from "react-helmet-async";
import QueryProvider from './providers/QueryProvider'; // TanStack Query Provider

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
   <HelmetProvider>
    <QueryProvider> {/* TanStack Query for data fetching & caching */}
     <Provider store={store}>
       <BrowserRouter>
         <SnackbarProvider maxSnack={3}>
           <App />
         </SnackbarProvider>
       </BrowserRouter>
     </Provider>
    </QueryProvider>
    </HelmetProvider>
  </React.StrictMode>
);
// ========== END NEW CODE ==========
