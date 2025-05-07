import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/SidebarComponent';
import Topbar from './components/TopbarComponent';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import ProductManagement from './pages/Product';
import CategoryManagement from './pages/Categories';
import Login from './pages/Login';
import CreateProduct from './pages/CreateProduct';
import EditProduct from './pages/EditProduct';
import CreateUser from './pages/CreateUser';
import EditUser from './pages/EditUser';
import OrderManagement from './pages/Order';
import EditOrder from './pages/EditOrder';
import OrderDetail from './pages/OrderDetail';
import BrandManagement from './pages/Brand';

// Component bảo vệ trang
const ProtectedRoute = ({ children, isAuthenticated }) => {
  return isAuthenticated ? children : <Navigate to="/" />;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Hàm xử lý đăng nhập thành công
  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  return (
    <Router>
      <div style={{ display: 'flex' }}>
        {isAuthenticated && <Sidebar />}
        <div style={{ flex: 1 }}>
          {isAuthenticated && <Topbar />}
          <main style={{ padding: '20px' }}>
            <Routes>
              <Route path="/" element={<Login onLogin={handleLogin} />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/users"
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <Users />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/products"
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <ProductManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/order"
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <OrderManagement />
                  </ProtectedRoute>
                }
              />
              <Route path="/order-details/:id" element={<OrderDetail />} />
              <Route
                path="/categories"
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <CategoryManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/categories"
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <CategoryManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/createproduct"
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <CreateProduct />
                  </ProtectedRoute>
                }
              />
              <Route path="/editproduct/:productId" element={<EditProduct />} />
              <Route
                path="/createuser"
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <CreateUser />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/edituser/:id"
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <EditUser />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/editorder/:id"
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <EditOrder />
                  </ProtectedRoute>
                }
              />
               <Route
                path="/brand"
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <BrandManagement />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
