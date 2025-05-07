import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  UserCircle,
  LogOut,
  LogIn,
  UserPlus,
  ShoppingCart,
  ClipboardList,
} from 'lucide-react';

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setIsDropdownOpen(false);
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-extrabold text-blue-600 tracking-tight hover:text-blue-700 transition">
              MyLaptop
            </Link>
          </div>

          {/* Menu */}
          <nav className="hidden md:flex space-x-8 text-sm font-medium">
            <Link to="/" className="text-gray-600 hover:text-blue-600 transition">Trang chủ</Link>
            <Link to="/about" className="text-gray-600 hover:text-blue-600 transition">Giới thiệu</Link>
            <Link to="/services" className="text-gray-600 hover:text-blue-600 transition">Dịch vụ</Link>
            <Link to="/contact" className="text-gray-600 hover:text-blue-600 transition">Liên hệ</Link>
          </nav>

          {/* Auth buttons / Avatar */}
          <div className="flex items-center space-x-4 relative">
            {isLoggedIn ? (
              <>
                {/* Icon giỏ hàng */}
                <Link to="/cart" className="relative group">
                  <ShoppingCart className="w-7 h-7 text-blue-600 hover:text-blue-700 transition" />
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                    0
                  </span>
                </Link>

                {/* Icon đơn hàng */}
                <Link to="/order" className="relative group">
                  <ClipboardList className="w-7 h-7 text-green-600 hover:text-green-700 transition" />
                </Link>

                {/* Avatar và Dropdown */}
                <div ref={dropdownRef} className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full hover:bg-blue-200 transition"
                  >
                    <UserCircle className="w-7 h-7 text-blue-700" />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-lg border z-50 overflow-hidden animate-fadeIn">
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 gap-2"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <UserCircle className="w-5 h-5" /> Hồ sơ
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-gray-50 gap-2"
                      >
                        <LogOut className="w-5 h-5" /> Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                >
                  <LogIn className="w-5 h-5" />
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm font-medium"
                >
                  <UserPlus className="w-5 h-5" />
                  Đăng ký
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
