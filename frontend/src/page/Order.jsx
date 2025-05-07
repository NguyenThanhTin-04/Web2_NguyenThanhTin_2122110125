import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

function Order() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    if (!token || !userId) {
      navigate('/auth/login');
      return;
    }

    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:8081/api/orders/user/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('Không thể lấy thông tin đơn hàng. Vui lòng thử lại!');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  return (
    <div className="min-h-screen px-4 py-12 bg-gradient-to-br from-blue-100 via-white to-blue-50 sm:px-6 lg:px-8">
      <ToastContainer />
      <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden">
        <h2 className="py-8 text-4xl font-bold text-center text-blue-700">🛒 Danh sách đơn hàng</h2>
        <div className="grid grid-cols-1 gap-10 px-10 pb-12 lg:grid-cols-2">
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-gray-800">📦 Các đơn hàng của bạn</h3>
            {loading ? (
              <div className="text-center py-6">Đang tải...</div>
            ) : (
              <div className="space-y-4">
                {orders.length === 0 ? (
                  <p className="text-center text-lg text-gray-600">Bạn chưa có đơn hàng nào.</p>
                ) : (
                  orders.map((order) => (
                    <div key={order.id} className="p-4 bg-white rounded-lg shadow hover:shadow-md transition">
                      <p className="text-lg font-semibold text-gray-800">Đơn hàng #{order.id}</p>
                      <p className="text-gray-500">Ngày đặt: {new Date(order.createdAt).toLocaleDateString()}</p>
                      <p className="text-blue-600 font-medium">Tổng tiền: {order.totalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                      <button
                        onClick={() => navigate(`/order/${order.id}`)}
                        className="mt-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
                      >
                        Xem chi tiết
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Order;
