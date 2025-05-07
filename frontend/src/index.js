import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';  // Import từ react-router-dom
import Home from './page/Home';
import Login from './auth/Login';
import Register from './auth/Register';
import Product from './product/Product';
import ProductDetails from './product/ProductDetails';
import Order from './page/Order';
import OrderDetail from './page/OrderDetail'
import Cart from './page/Cart';
import Checkout from './page/Checkout';
import PaymentSuccessful from './page/PaymentSuccessful';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: 'login',
        element: <Login />
      },
      {
        path: 'register',
        element: <Register />
      },

      {
        path: 'product',
        element: <Product />
      },
      {
        path: '/Product/:id',
        element: <ProductDetails />
      }
      ,
      {
        path: '/Order',
        element: <Order />
      },
      {
        path: '/OrderDetail/order/:orderId',
        element: <OrderDetail />
      },
      {
        path: '/Cart',
        element: <Cart />
      },
      {
        path: '/Checkout',
        element: <Checkout />
      },
      {
        path: '/paymentsuccessful',
        element: <PaymentSuccessful />
      },



    ]
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

reportWebVitals();
