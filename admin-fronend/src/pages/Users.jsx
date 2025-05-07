import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const apiUrl = "http://localhost:8081/api/users"; // Đảm bảo URL API đúng

  useEffect(() => {
    fetchUsers();
  }, []);

  // Lấy danh sách người dùng từ API
  const fetchUsers = async () => {
    try {
      const response = await axios.get(apiUrl); // Gọi API GET để lấy danh sách người dùng
      setUsers(response.data); // Lưu dữ liệu người dùng vào state
    } catch (error) {
      console.error("Error fetching users:", error);
      alert("Không thể tải danh sách người dùng.");
    }
  };

  // Xoá người dùng
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xoá người dùng này?")) return;

    try {
      await axios.delete(`${apiUrl}/${id}`); // Gọi API DELETE để xoá người dùng
      setUsers(users.filter((user) => user.id !== id)); // Cập nhật danh sách người dùng sau khi xoá
    } catch (error) {
      console.error("Delete Error:", error);
      alert("Không thể xoá người dùng.");
    }
  };

  // Tạo người dùng mới
  const handleCreateUser = () => {
    navigate("/createuser"); // Chuyển đến trang tạo người dùng
  };

  // Chỉnh sửa người dùng
  const handleEdit = (user) => {
    navigate(`/edituser/${user.id}`); // Chuyển đến trang sửa người dùng
  };

  return (
    <div className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 min-h-screen">
      <div className="flex justify-between items-center mb-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800">Quản lý người dùng</h1>
        <button
          onClick={handleCreateUser}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
        >
          + Thêm người dùng
        </button>
      </div>

      {/* Danh sách người dùng */}
      <div className="grid gap-4 max-w-4xl mx-auto">
        {users.length > 0 ? (
          users.map((user) => (
            <div
              key={user.id}
              className="p-4 border rounded-xl shadow bg-white hover:bg-gray-50 transition duration-200"
            >
              <p><strong>Tên:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p>
                <strong>Role:</strong>{" "}
                <span className={`font-semibold ${user.role === "Admin" ? "text-red-600" : "text-blue-600"}`}>
                  {user.role}
                </span>
              </p>
              <div className="flex space-x-3 mt-3">
                <button
                  onClick={() => handleEdit(user)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg"
                >
                  Sửa
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                >
                  Xoá
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">Không có người dùng nào</div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
