import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const OrderDetail = () => {
    const [orderDetails, setOrderDetails] = useState([]);
    const [error, setError] = useState(null); // State to handle errors
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const fetchOrderDetails = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/"); // If no token, redirect to home/login
                return;
            }

            try {
                // Lấy thông tin chi tiết đơn hàng
                const response = await axios.get(
                    `http://localhost:8081/api/order-details/order/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setOrderDetails(response.data); // Set order details from response
                setError(null); // Reset error if the request is successful
            } catch (error) {
                // Handle different types of errors
                if (axios.isAxiosError(error)) {
                    if (error.response?.status === 404) {
                        setError("Không tìm thấy chi tiết đơn hàng.");
                    } else if (error.response?.status === 401) {
                        localStorage.removeItem("token"); // Remove token if unauthorized
                        navigate("/"); // Redirect to home/login
                    } else {
                        setError("Lỗi khi tải chi tiết đơn hàng.");
                    }
                } else {
                    setError("Lỗi hệ thống.");
                }
                console.error("Lỗi khi tải chi tiết đơn hàng:", error); // Log error for debugging
            }
        };

        fetchOrderDetails();
    }, [navigate, id]);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Chi tiết đơn hàng #{id}</h1>
            {error && (
                <div className="text-red-500 mb-4 font-semibold">
                    <p>{error}</p>
                </div>
            )}
            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                    <tr>
                        <th className="px-6 py-3 border-b">ID</th>
                        <th className="px-6 py-3 border-b">Mã Đơn Hàng</th>
                        <th className="px-6 py-3 border-b">Số lượng</th>
                        <th className="px-6 py-3 border-b">Giá</th>
                    </tr>
                </thead>
                <tbody>
                    {orderDetails.length > 0 ? (
                        orderDetails.map((detail) => (
                            <tr key={detail.id}>
                                <td className="px-6 py-4 border-b text-center">{detail.id}</td>
                                <td className="px-6 py-4 border-b text-center">{detail.orderId}</td>
                                <td className="px-6 py-4 border-b text-center">{detail.quantity}</td>
                                <td className="px-6 py-4 border-b text-center text-red-600 font-semibold">
                                    {detail.price.toLocaleString()} VND
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={4} className="px-6 py-4 border-b text-center text-gray-500">
                                Đang tải dữ liệu...
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default OrderDetail;
