import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react"; // icon con mắt

const Order = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get("http://localhost:8081/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setOrders(res.data);
      })
      .catch((err) => {
        console.error("Lỗi khi tải đơn hàng:", err);
        if (err.response?.status === 403) alert("Bạn không có quyền truy cập!");
      });
  }, [token, navigate]);

  const handleViewDetail = (orderId) => {
    navigate(`/order-details/${orderId}`);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">Quản lý Đơn hàng</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-md">
          <thead className="bg-blue-100 text-gray-700">
            <tr>
              <th className="px-6 py-3 text-left">Tên</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">SĐT</th>
              <th className="px-6 py-3 text-left">Địa chỉ</th>
              <th className="px-6 py-3 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4">{order.name}</td>
                <td className="px-6 py-4">{order.email}</td>
                <td className="px-6 py-4">{order.phone}</td>
                <td className="px-6 py-4">{order.address}</td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => handleViewDetail(order.id)}
                    className="text-blue-600 hover:text-blue-800 transition"
                    title="Xem chi tiết"
                  >
                    <Eye className="w-5 h-5 inline" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Order;
