import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const EditUser = () => {
  const { id } = useParams(); // Lấy ID từ URL
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const apiUrl = `http://localhost:8081/api/users/${id}`;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(apiUrl);
        setUser(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user:", error);
        alert("Không thể tải thông tin người dùng.");
      }
    };
    fetchUser();
  }, [id]);

  const handleSave = async () => {
    try {
      await axios.put(apiUrl, user); // Giả sử API của anh hỗ trợ PUT để cập nhật người dùng
      alert("Thông tin người dùng đã được cập nhật!");
      navigate("/usermanagement"); // Quay lại trang quản lý người dùng sau khi lưu
    } catch (error) {
      console.error("Error saving user:", error);
      alert("Không thể cập nhật thông tin người dùng.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-blue-100">
      {loading ? (
        <div className="text-center text-xl font-semibold text-gray-700">Đang tải...</div>
      ) : (
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Chỉnh sửa người dùng</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Tên người dùng:</label>
              <input
                type="text"
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Email:</label>
              <input
                type="email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Vai trò:</label>
              <select
                value={user.role}
                onChange={(e) => setUser({ ...user, role: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="User">User</option>
                <option value="Admin">Admin</option>
              </select>
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

export default EditUser;
