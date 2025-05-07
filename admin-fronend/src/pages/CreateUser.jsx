import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateUser = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    password_Confirm: '',
    role: '',
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [createdUser, setCreatedUser] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage('');

    try {
      // Loại bỏ password_Confirm nếu backend không cần
      const { password_Confirm, ...payload } = formData;

      const response = await fetch('http://localhost:8081/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const userData = await response.json();
        setCreatedUser(userData);
        setSuccessMessage('User created successfully!');
        setTimeout(() => navigate('/userlist'), 1500);
      } else {
        const errorData = await response.json();
        setErrors(errorData.errors || {});
        alert('Failed to create user: ' + (errorData.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while creating the user. Please check if the backend is running.');
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Add New User</h2>
      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div className="mb-4">
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            required
          />
          {errors.name && <p className="text-red-500">{errors.name.join(', ')}</p>}
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            required
          />
          {errors.email && <p className="text-red-500">{errors.email.join(', ')}</p>}
        </div>

        {/* Phone */}
        <div className="mb-4">
          <label className="block text-gray-700">Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            required
          />
          {errors.phone && <p className="text-red-500">{errors.phone.join(', ')}</p>}
        </div>

        {/* Address */}
        <div className="mb-4">
          <label className="block text-gray-700">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            required
          />
          {errors.address && <p className="text-red-500">{errors.address.join(', ')}</p>}
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            required
          />
          {errors.password && <p className="text-red-500">{errors.password.join(', ')}</p>}
        </div>

        {/* Confirm Password */}
        <div className="mb-4">
          <label className="block text-gray-700">Confirm Password</label>
          <input
            type="password"
            name="password_Confirm"
            value={formData.password_Confirm}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${errors.password_Confirm ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            required
          />
          {errors.password_Confirm && <p className="text-red-500">{errors.password_Confirm.join(', ')}</p>}
        </div>

        {/* Role */}
        <div className="mb-4">
          <label className="block text-gray-700">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${errors.role ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            required
          >
            <option value="">Select role</option>
            <option value="User">User</option>
            <option value="Admin">Admin</option>
          </select>
          {errors.role && <p className="text-red-500">{errors.role.join(', ')}</p>}
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-300"
        >
          Add User
        </button>

        {successMessage && <p className="mt-4 text-green-500">{successMessage}</p>}

        {/* Hiển thị thông tin user vừa tạo */}
        {createdUser && (
          <div className="mt-6 p-4 bg-gray-100 rounded-md">
            <h3 className="text-xl font-semibold">User Details</h3>
            <p><strong>ID:</strong> {createdUser.id}</p>
            <p><strong>Name:</strong> {createdUser.name}</p>
            <p><strong>Email:</strong> {createdUser.email}</p>
            <p><strong>Phone:</strong> {createdUser.phone}</p>
            <p><strong>Address:</strong> {createdUser.address}</p>
            <p><strong>Role:</strong> {createdUser.role}</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default CreateUser;
