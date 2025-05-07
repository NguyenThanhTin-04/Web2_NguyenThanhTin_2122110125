import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';

function Product() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:8081/api/products');
        setProducts(response.data); // Đảm bảo API trả về mảng sản phẩm
      } catch (error) {
        console.error('Error fetching products:', error);
        Swal.fire({ icon: 'error', text: 'Failed to fetch products' });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Delete product
  const deleteProduct = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:8081/api/products/${id}`);
      setProducts(products.filter((product) => product.id !== id));
      Swal.fire({ icon: 'success', text: 'Product deleted successfully' });
    } catch (error) {
      console.error('Error deleting product:', error);
      Swal.fire({ icon: 'error', text: 'Failed to delete product' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 min-h-screen">
      <h1 className="text-3xl font-semibold mb-6 text-center text-gray-800">Product Management</h1>

      {/* Add Product Button */}
      <div className="flex justify-end mb-6">
        <Link to="/createproduct">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105">
            Add Product
          </button>
        </Link>
      </div>

      {/* Loading Spinner */}
      {loading && <div className="text-center text-xl">Loading...</div>}

      {/* Product Table */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg p-4">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">ID</th>
              <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Category</th>
              <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Name</th>
              <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Brand</th>
              <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Image</th>
              <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Description</th>
              <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Details</th>
              <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Price</th>
              <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Quantity</th>
              <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product) => (
                <tr key={product.id} className="border-b hover:bg-gray-50 transition-colors duration-200">
                  <td className="py-3 px-6">{product.id}</td>
                  <td className="py-3 px-6">{product.category?.name}</td>
                  <td className="py-3 px-6">{product.name}</td>
                  <td className="py-3 px-6">{product.brand?.name}</td>
                  <td className="py-3 px-6">
                    {product.image && (
                      <img
                      src={`http://localhost:8081/images/${product.image}`} 
                        alt={product.name}
                        style={{ width: '50px', height: 'auto' }}
                        className="rounded-lg"
                      />
                    )}
                  </td>
                  <td className="py-3 px-6">{product.description}</td>
                  <td className="py-3 px-6">{product.details}</td>
                  <td className="py-3 px-6">{product.price.toLocaleString()}₫</td>
                  <td className="py-3 px-6">{product.quantity}</td>
                  <td className="py-3 px-6">
                    <div className="flex space-x-4">
                      <Link to={`/editproduct/${product.id}`}>
                        <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200">
                          Edit
                        </button>
                      </Link>
                      <button
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200"
                        onClick={() => deleteProduct(product.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="py-3 px-6 text-center text-gray-500">
                  No products available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Product;
