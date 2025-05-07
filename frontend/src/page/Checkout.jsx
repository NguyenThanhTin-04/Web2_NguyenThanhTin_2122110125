import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

function Checkout() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    note: '',
    email: ''
  });
  const [paymentStatus, setPaymentStatus] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/auth/login');
      return;
    }

    const fetchCart = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          navigate('/auth/login');
          return;
        }

        const response = await axios.get(`http://localhost:8081/api/carts/user/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        setCartItems(response.data || []);
      } catch (error) {
        console.error('Error fetching cart:', error);
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          navigate('/auth/login');
        }
      }
    };

    fetchCart();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      const userEmail = formData.email || localStorage.getItem('email');
  
      if (!token || !userId) {
        navigate('/auth/login');
        return;
      }
  
      // 1. Tạo đơn hàng
      const orderResponse = await axios.post('http://localhost:8081/api/orders',
        {
          name: formData.name,
          email: userEmail,
          phone: formData.phone,
          address: formData.address,
          user: {
            id: parseInt(userId)
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      const orderId = orderResponse.data.id;
  
      // 2. Tạo chi tiết đơn hàng
      for (const item of cartItems) {
        await axios.post('http://localhost:8081/api/order-details',
          {
            orderId,
            productId: item.product.id,
            quantity: item.quantity,
            price: item.product.price
          },
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
      }
  
      // 3. Xóa các sản phẩm trong giỏ hàng
      for (const item of cartItems) {
        await axios.delete(`http://localhost:8081/api/carts/${item.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
  
      // 4. Hiển thị thông báo và điều hướng
      toast.success('Thanh toán thành công!');
      setTimeout(() => navigate('/paymentsuccessful'), 2000);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Thanh toán không thành công. Vui lòng thử lại!');
    }
  };
  

  return (
    <div className="min-h-screen px-4 py-12 bg-gradient-to-br from-blue-100 via-white to-blue-50 sm:px-6 lg:px-8">
      <ToastContainer />
      <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden">
        <h2 className="py-8 text-4xl font-bold text-center text-blue-700">🛒 Xác nhận đơn hàng</h2>
        <div className="grid grid-cols-1 gap-10 px-10 pb-12 lg:grid-cols-2">

          {/* Form nhận thông tin */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-gray-800">📦 Thông tin người nhận</h3>
            <div className="relative">
              <input
                type="text"
                placeholder="Họ và tên"
                className="w-full px-4 py-3 border rounded-md"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="relative">
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-3 border rounded-md"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="relative">
              <input
                type="tel"
                placeholder="Số điện thoại"
                className="w-full px-4 py-3 border rounded-md"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Địa chỉ giao hàng"
                className="w-full px-4 py-3 border rounded-md"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Chi tiết đơn hàng */}
          <div className="p-6 border border-gray-200 bg-gray-50 rounded-2xl">
            <h3 className="mb-4 text-2xl font-semibold text-gray-700">🧾 Chi tiết đơn hàng</h3>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1.5">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 bg-white rounded-lg shadow hover:shadow-md transition"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={`http://localhost:8081/images/${item.product.image}`}
                      alt={item.product.name}
                      className="object-cover w-16 h-16 rounded-lg"
                    />
                    <div>
                      <p className="font-medium text-gray-800">{item.product.name}</p>
                      <p className="text-sm text-gray-500">x{item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-semibold text-blue-600">
                    {item.product.price.toLocaleString('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    })}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center pt-6 mt-6 border-t text-lg font-semibold">
              <span>Tổng cộng:</span>
              <span className="text-2xl font-bold text-blue-700">{calculateTotal().toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
            </div>
            <button
              onClick={handleSubmit}
              className="w-full py-3 mt-6 font-semibold text-white bg-blue-600 hover:bg-blue-700 transition rounded-xl"
            >
              ✅ Thanh toán ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
