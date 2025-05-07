import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const EditOrder = () => {
    const { id } = useParams(); // Lấy ID từ URL
    const [order, setOrder] = useState({ // Khởi tạo giá trị mặc định
        id: "",
        userId: "",
        name: "",
        phone: "",
        email: "",
        address: "",
        orderDetails: [],
    });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const apiUrl = `https://localhost:7024/api/Order/${id}`;

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await axios.get(apiUrl);
                // Đảm bảo dữ liệu trả về có orderDetails, nếu không thì gán mặc định là mảng rỗng
                const fetchedOrder = {
                    ...response.data,
                    orderDetails: response.data.orderDetails || [],
                };
                setOrder(fetchedOrder);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching order:", error);
                alert("Không thể tải thông tin đơn hàng.");
                setLoading(false); // Vẫn đặt loading là false để tránh treo giao diện
            }
        };
        fetchOrder();
    }, [id]);

    const handleSave = async () => {
        try {
            await axios.put(apiUrl, order); // Cập nhật thông tin đơn hàng
            alert("Thông tin đơn hàng đã được cập nhật!");
            navigate("/ordermanagement"); // Quay lại trang quản lý đơn hàng sau khi lưu
        } catch (error) {
            console.error("Error saving order:", error);
            alert("Không thể cập nhật thông tin đơn hàng.");
        }
    };

    // Hàm xử lý thay đổi trong chi tiết đơn hàng
    const handleOrderDetailChange = (index, field, value) => {
        const updatedOrderDetails = [...order.orderDetails];
        updatedOrderDetails[index] = { ...updatedOrderDetails[index], [field]: value };
        setOrder({ ...order, orderDetails: updatedOrderDetails });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-blue-100">
            {loading ? (
                <div className="text-center text-xl font-semibold text-gray-700">Đang tải...</div>
            ) : (
                <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
                    <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Chỉnh sửa đơn hàng</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">ID đơn hàng:</label>
                            <input
                                type="text"
                                value={order.id}
                                disabled
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">ID người dùng:</label>
                            <input
                                type="text"
                                value={order.userId}
                                disabled
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Tên người dùng:</label>
                            <input
                                type="text"
                                value={order.name}
                                onChange={(e) => setOrder({ ...order, name: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Số điện thoại:</label>
                            <input
                                type="text"
                                value={order.phone}
                                onChange={(e) => setOrder({ ...order, phone: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Email:</label>
                            <input
                                type="email"
                                value={order.email}
                                onChange={(e) => setOrder({ ...order, email: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Địa chỉ:</label>
                            <input
                                type="text"
                                value={order.address}
                                onChange={(e) => setOrder({ ...order, address: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Chi tiết đơn hàng:</label>
                            {order.orderDetails.length > 0 ? (
                                order.orderDetails.map((detail, index) => (
                                    <div key={index} className="border p-4 rounded-lg mb-4">
                                        <div className="flex space-x-4">
                                            <div className="flex-1">
                                                <label className="block text-gray-600 text-sm">ID chi tiết:</label>
                                                <input
                                                    type="text"
                                                    value={detail.id}
                                                    disabled
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <label className="block text-gray-600 text-sm">ID đơn hàng:</label>
                                                <input
                                                    type="text"
                                                    value={detail.orderId}
                                                    disabled
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex space-x-4 mt-2">
                                            <div className="flex-1">
                                                <label className="block text-gray-600 text-sm">ID sản phẩm:</label>
                                                <input
                                                    type="text"
                                                    value={detail.productId}
                                                    onChange={(e) => handleOrderDetailChange(index, "productId", e.target.value)}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <label className="block text-gray-600 text-sm">Số lượng:</label>
                                                <input
                                                    type="number"
                                                    value={detail.quantity}
                                                    onChange={(e) => handleOrderDetailChange(index, "quantity", parseInt(e.target.value))}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-gray-600 text-center">Không có chi tiết đơn hàng.</div>
                            )}
                        </div>
                        <div className="flex justify-center mt-6">
                            <button
                                onClick={handleSave}
                                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg text-lg font-semibold transition duration-200"
                            >
                                Lưu thay đổi
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditOrder;