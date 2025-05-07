import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/auth/login');
          return;
        }

        const response = await axios.get(`http://localhost:8081/api/products/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          navigate('/auth/login');
        } else if (axios.isAxiosError(error) && error.response?.status === 403) {
          alert('Bạn không có quyền truy cập sản phẩm này!');
        }
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const handleAddToCart = async () => {
    try {
      setIsAddingToCart(true);
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      if (!token || !userId) {
        navigate('/auth/login');
        return;
      }

      await axios.post(
        'http://localhost:8081/api/carts',
        {
          product: { id: product?.id },
          quantity: quantity,
          user: { id: Number(userId) },
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );

      alert('Thêm vào giỏ hàng thành công!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        navigate('/auth/login');
      } else if (axios.isAxiosError(error) && error.response?.status === 403) {
        alert('Bạn không có quyền truy cập giỏ hàng!');
      }
      alert('Có lỗi xảy ra khi thêm vào giỏ hàng!');
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-xl p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Section */}
            <div className="flex justify-center items-center">
              <img
                src={`http://localhost:8081/images/${product.image}`}
                alt={product.name}
                className="w-full max-w-[450px] h-auto object-cover rounded-lg shadow-lg transition-transform duration-300 ease-in-out hover:scale-105"
              />
            </div>

            {/* Product Details */}
            <div className="py-6 px-2 lg:px-8">
              <h2 className="text-3xl font-semibold text-slate-900">{product.name}</h2>
              <p className="text-md text-slate-600 mt-2">{product.description}</p>

              {/* Rating */}
              <div className="flex items-center space-x-1 mt-4">
                {[...Array(5)].map((_, index) => (
                  <svg
                    key={index}
                    className={`w-5 h-5 ${index < 4 ? 'fill-yellow-400' : 'fill-gray-300'}`}
                    viewBox="0 0 14 13"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                  </svg>
                ))}
              </div>

              {/* Price Box */}
              <div className="mb-6 border rounded-lg p-4 bg-white shadow-sm mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Giá sản phẩm</h3>
                <p className="text-2xl font-bold text-blue-600">
                  {product.price.toLocaleString()} VND
                </p>
                {product.priceSale && (
                  <p className="text-md font-medium text-red-500 line-through mt-1">
                    {product.priceSale.toLocaleString()} VND
                  </p>
                )}
              </div>

              {/* Technical Specs */}
              <div className="mb-6 border rounded-lg p-4 bg-gray-50 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m2 8H7a2 2 0 01-2-2V6a2 2 0 012-2h3.586a1 1 0 01.707.293l1.414 1.414A1 1 0 0013.414 6H17a2 2 0 012 2v10a2 2 0 01-2 2z" />
                  </svg>
                  Thông số kỹ thuật
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-gray-700 text-sm">
                  <li><span className="font-medium">Chip xử lý:</span> {product.cpu || 'Snapdragon 8 Gen 2'}</li>
                  <li><span className="font-medium">RAM:</span> {product.ram || '8GB'}</li>
                  <li><span className="font-medium">Bộ nhớ trong:</span> {product.storage || '128GB'}</li>
                  <li><span className="font-medium">Màn hình:</span> {product.screen || '6.7" AMOLED, 120Hz'}</li>
                  <li><span className="font-medium">Camera:</span> {product.camera || '50MP + 12MP + 10MP'}</li>
                  <li><span className="font-medium">Pin:</span> {product.battery || '5000mAh, sạc nhanh 45W'}</li>
                  <li><span className="font-medium">Hệ điều hành:</span> {product.os || 'Android 13'}</li>
                </ul>
              </div>

              {/* Color */}
              <div className="mb-6 border rounded-lg p-4 bg-white shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m0 4v12m0 0l-4-4m4 4l4-4" />
                  </svg>
                  Màu sắc
                </h3>
                <span className="px-3 py-1 bg-gray-200 rounded-full text-sm text-gray-800 inline-block">
                  {product.color || 'Đen ánh kim'}
                </span>
              </div>

              {/* Quantity + Add to Cart */}
              <div className="mb-6 border rounded-lg p-4 bg-white shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Số lượng & Giỏ hàng</h3>
                <div className="flex items-center space-x-4">
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    min="1"
                    className="w-20 h-10 border-2 border-gray-300 rounded-lg text-center"
                  />
                  <button
                    onClick={handleAddToCart}
                    disabled={isAddingToCart}
                    className="flex-1 h-12 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all"
                  >
                    {isAddingToCart ? 'Đang thêm...' : 'Thêm vào giỏ hàng'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
