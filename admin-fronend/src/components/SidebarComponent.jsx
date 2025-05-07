// src/components/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';

function Sidebar() {
  return (
    <div className="w-52 bg-gray-800 text-white h-screen">
      <h2 className="text-center text-2xl py-4">Admin</h2>
      <nav>
        <ul className="list-none p-0">
          <li className="py-2 px-4 hover:bg-gray-700">
            <Link to="/" className="text-white no-underline">Dashboard</Link>
          </li>
          <li className="py-2 px-4 hover:bg-gray-700">
            <Link to="/users" className="text-white no-underline">Users</Link>
          </li>
          {/* <li className="py-2 px-4 hover:bg-gray-700">
            <Link to="/login" className="text-white no-underline">Login</Link>
          </li> */}
          
          <li className="py-2 px-4 hover:bg-gray-700">
            <Link to="/products" className="text-white no-underline">Products</Link>
          </li>
          <li className="py-2 px-4 hover:bg-gray-700">
            <Link to="/categories" className="text-white no-underline">Categories</Link>
          </li>
          <li className="py-2 px-4 hover:bg-gray-700">
            <Link to="/brand" className="text-white no-underline">Brand</Link>
          </li>
          <li className="py-2 px-4 hover:bg-gray-700">
            <Link to="/order" className="text-white no-underline">Order</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;
