import { useState } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8081/api/users/login',
        JSON.stringify(formData),
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      if (response.data) {
        // Save login data to localStorage
        localStorage.setItem('userId', response.data.id);
        localStorage.setItem('email', response.data.email);
        localStorage.setItem('token', response.data.token);

        // Navigate to home page
        navigate('/');
        window.location.reload();
      }
    } catch (error) {
      console.error('Login error:', error);
      // Handle login error
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center ">
        <div className="bg-white p-8 rounded-xl shadow-lg w-96">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Đăng nhập</h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nhập email của bạn"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu
              </label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nhập mật khẩu của bạn"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 text-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                  Ghi nhớ đăng nhập
                </label>
              </div>
              <a href="#" className="text-sm text-blue-500 hover:text-blue-600">
                Quên mật khẩu?
              </a>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-300"
            >
              Đăng nhập
            </button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Chưa có tài khoản?{' '}
              <a href="#" className="text-blue-500 hover:text-blue-600">
                Đăng ký ngay
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login
