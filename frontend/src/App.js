import React from 'react';
import { Provider } from 'react-redux';
import { Outlet, useLocation } from "react-router-dom";
import { createStore } from 'redux';
import Footer from './layouts/Footer'
import Header from './layouts/Header';
import rootReducer from './reducer/Reducer';

const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

function App() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <Provider store={store}>
      {!isAuthPage && <Header />}
      <Outlet />
      {!isAuthPage && <Footer />}
    </Provider>
  );
}

export default App;

