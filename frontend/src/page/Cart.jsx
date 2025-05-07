import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Cart() {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const token = localStorage.getItem('token');
                const userId = localStorage.getItem('userId');
                if (!token || !userId) return;

                const response = await axios.get(`http://localhost:8081/api/carts/user/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                setCartItems(response.data || []);
            } catch (error) {
                console.error('Error fetching cart:', error);
                setCartItems([]);
            }
        };

        fetchCart();
    }, []);

    const handleQuantityChange = async (cartItemId, change) => {
        try {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');
            if (!token || !userId) return;

            await axios.put(
                `http://localhost:8081/api/carts/${cartItemId}`,
                {
                    quantity: change
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            // Refresh cart data
            const response = await axios.get(`http://localhost:8081/api/carts/user/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            setCartItems(response.data || []);
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    };

    const handleRemoveProduct = async (cartItemId) => {
        try {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');
            if (!token || !userId) return;

            // Remove item locally first for better UX
            setCartItems(prevItems => prevItems.filter(item => item.id !== cartItemId));

            await axios.delete(
                `http://localhost:8081/api/carts/${cartItemId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

        } catch (error) {
            console.error('Error removing product:', error);
            // If deletion fails, refresh cart to restore original state
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');
            if (!token || !userId) return;

            const response = await axios.get(`http://localhost:8081/api/carts/user/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setCartItems(response.data || []);
        }
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-semibold text-gray-900 mb-8 text-center">Giỏ hàng của bạn</h1>

                <div className="bg-white rounded-lg shadow-lg p-8 mb-6 space-y-6">
                    {cartItems.length > 0 ? (
                        cartItems.map((item) => (
                            <div key={item.id} className="flex items-center border-b pb-6">
                                <img
                                    src={`http://localhost:8081/images/${item.product.image}`}
                                    alt={item.product.name}
                                    className="w-32 h-32 object-cover rounded-lg shadow-md"
                                />
                                <div className="ml-6 flex-1">
                                    <h3 className="text-xl font-semibold text-gray-800">{item.product.name}</h3>
                                    <p className="text-gray-600 mt-2">{item.product.description}</p>
                                    <div className="mt-4 flex items-center justify-between">
                                        <p className="text-lg text-blue-600 font-medium">{item.product.price.toLocaleString()} VND</p>
                                        <div className="flex items-center space-x-4">
                                            <div className="flex items-center border rounded-md overflow-hidden">
                                                <button
                                                    onClick={() => handleQuantityChange(item.id, Math.max(1, item.quantity - 1))}
                                                    className="px-3 py-1 border-r hover:bg-gray-100"
                                                >
                                                    -
                                                </button>
                                                <span className="px-4 py-1">{item.quantity}</span>
                                                <button
                                                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                                    className="px-3 py-1 border-l hover:bg-gray-100"
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => handleRemoveProduct(item.id)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 bg-blue-50 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-blue-400 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 7h11L17 13M7 13h10M10 21a1 1 0 100-2 1 1 0 000 2zm7 0a1 1 0 100-2 1 1 0 000 2z" />
                            </svg>
                            <p className="text-2xl font-semibold text-blue-600 mb-4">Giỏ hàng của bạn đang trống</p>
                            <p className="text-gray-500 mb-6">Hãy chọn những sản phẩm yêu thích để thêm vào giỏ hàng</p>
                            <Link to="/" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition">
                                🛍️ Tiếp tục mua sắm
                            </Link>
                        </div>

                    )}

                    {cartItems.length > 0 && (
                        <div className="mt-6 flex justify-between items-center">
                            <p className="text-lg font-medium text-blue-600">Tổng tiền: {calculateTotal().toLocaleString()} VND</p>
                            <Link to="/checkout">
                                <button className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition duration-200">
                                    Tiến hành thanh toán
                                </button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Cart;
