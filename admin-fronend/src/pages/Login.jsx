import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        try {
            const response = await axios.post('http://localhost:8081/api/users/login', {
                email,
                password,
            });

            const { token, email: userEmail, role, id } = response.data; // Thay đổi lấy trực tiếp role, email và id từ API trả về

            if (role === 'Admin') { // Kiểm tra giá trị role là chuỗi '1'
                localStorage.setItem('token', token);
                localStorage.setItem('userEmail', userEmail);
                localStorage.setItem('userId', id);

                onLogin(); // Gọi hàm onLogin để cập nhật trạng thái đăng nhập
                navigate('/dashboard'); // Điều hướng đến trang dashboard sau khi đăng nhập thành công
            } else {
                setErrorMessage('Bạn không có quyền truy cập.');
            }
        } catch (error) {
            if (error.response) {
                setErrorMessage(error.response.data.error || 'Thông tin đăng nhập không chính xác.');
            } else {
                setErrorMessage('Không thể kết nối đến máy chủ.');
            }
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">Đăng Nhập</h2>

                {errorMessage && (
                    <p className="text-red-500 mb-4 text-center">{errorMessage}</p>
                )}

                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-200"
                            placeholder="Nhập email của bạn"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="password">Mật Khẩu</label>
                        <input
                            type="password"
                            id="password"
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-200"
                            placeholder="Nhập mật khẩu của bạn"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
                    >
                        Đăng Nhập
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
