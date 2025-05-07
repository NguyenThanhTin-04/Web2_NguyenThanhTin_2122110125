import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    imageFile: null,
    categoryId: '',
    brandId: '',
    quantity: '',
  });

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [createdProduct, setCreatedProduct] = useState(null);

  useEffect(() => {
    // Load danh mục và thương hiệu
    axios.get('http://localhost:8081/api/categories')
      .then(res => setCategories(res.data))
      .catch(err => console.error('Lỗi khi tải danh mục:', err));

    axios.get('http://localhost:8081/api/brands')
      .then(res => setBrands(res.data))
      .catch(err => console.error('Lỗi khi tải thương hiệu:', err));
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'imageFile' && files.length > 0) {
      setFormData({ ...formData, imageFile: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage('');

    if (!formData.categoryId || !formData.brandId) {
      alert("Vui lòng chọn đầy đủ danh mục và thương hiệu.");
      return;
    }

    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('image', formData.imageFile);
    data.append('category_id', formData.categoryId);
    data.append('brand_id', formData.brandId);
    data.append('quantity', formData.quantity);

    try {
      const response = await fetch('http://localhost:8081/api/products', {
        method: 'POST',
        body: data,
      });

      if (response.ok) {
        const productData = await response.json();
        setCreatedProduct(productData);
        setSuccessMessage('Thêm sản phẩm thành công!');
        setTimeout(() => navigate('/productlist'), 1500);
      } else {
        const errorData = await response.json();
        setErrors(errorData.errors || {});
        alert('Thêm sản phẩm thất bại: ' + (errorData.message || 'Lỗi không xác định'));
      }
    } catch (error) {
      console.error('Lỗi:', error);
      alert('Đã xảy ra lỗi khi gửi dữ liệu.');
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Thêm Sản Phẩm Mới</h2>
      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div className="mb-4">
          <label className="block text-gray-700">Tên sản phẩm</label>
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

        {/* Description */}
        <div className="mb-4">
          <label className="block text-gray-700">Mô tả</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            required
          />
          {errors.description && <p className="text-red-500">{errors.description.join(', ')}</p>}
        </div>

        {/* Price */}
        <div className="mb-4">
          <label className="block text-gray-700">Giá</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${errors.price ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            required
          />
          {errors.price && <p className="text-red-500">{errors.price.join(', ')}</p>}
        </div>

        {/* Image */}
        <div className="mb-4">
          <label className="block text-gray-700">Hình ảnh</label>
          <input
            type="file"
            name="imageFile"
            accept="image/*"
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${errors.imageFile ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            required
          />
          {errors.imageFile && <p className="text-red-500">{errors.imageFile.join(', ')}</p>}
        </div>

        {/* Category */}
        <div className="mb-4">
          <label className="block text-gray-700">Danh mục</label>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${errors.categoryId ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            required
          >
            <option value="">-- Chọn danh mục --</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          {errors.categoryId && <p className="text-red-500">{errors.categoryId.join(', ')}</p>}
        </div>

        {/* Brand */}
        <div className="mb-4">
          <label className="block text-gray-700">Thương hiệu</label>
          <select
            name="brandId"
            value={formData.brandId}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${errors.brandId ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            required
          >
            <option value="">-- Chọn thương hiệu --</option>
            {brands.map(brand => (
              <option key={brand.id} value={brand.id}>{brand.name}</option>
            ))}
          </select>
          {errors.brandId && <p className="text-red-500">{errors.brandId.join(', ')}</p>}
        </div>

        {/* Quantity */}
        <div className="mb-4">
          <label className="block text-gray-700">Số lượng</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${errors.quantity ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            required
          />
          {errors.quantity && <p className="text-red-500">{errors.quantity.join(', ')}</p>}
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
        >
          Thêm sản phẩm
        </button>

        {successMessage && <p className="mt-4 text-green-600">{successMessage}</p>}

        {createdProduct && (
          <div className="mt-6 p-4 bg-gray-100 rounded-md">
            <h3 className="text-xl font-semibold">Chi tiết sản phẩm đã tạo</h3>
            <p><strong>ID:</strong> {createdProduct.id}</p>
            <p><strong>Tên:</strong> {createdProduct.name}</p>
            <p><strong>Giá:</strong> {createdProduct.price}</p>
            <p><strong>Số lượng:</strong> {createdProduct.quantity}</p>
            <p><strong>Danh mục:</strong> {createdProduct.category?.name}</p>
            <p><strong>Thương hiệu:</strong> {createdProduct.brand?.name}</p>
            <p><strong>Ảnh:</strong> {createdProduct.imageUrl}</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default CreateProduct;
