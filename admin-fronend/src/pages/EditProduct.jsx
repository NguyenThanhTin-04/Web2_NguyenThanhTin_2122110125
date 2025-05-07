import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function EditProduct() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    brandId: '',
    imageFile: null,
  });

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch current product data and categories/brands
  useEffect(() => {
    axios.get(`http://localhost:8081/api/products/${productId}`)
      .then(res => {
        const product = res.data;
        setFormData({
          name: product.name,
          description: product.description,
          price: product.price,
          categoryId: product.category?.id || '',
          brandId: product.brand?.id || '',
          imageFile: null,
        });
      })
      .catch(err => {
        console.error('Lỗi khi tải dữ liệu sản phẩm:', err);
      });

    axios.get('http://localhost:8081/api/categories')
      .then(res => setCategories(res.data))
      .catch(err => console.error('Lỗi khi tải danh mục:', err));

    axios.get('http://localhost:8081/api/brands')
      .then(res => setBrands(res.data))
      .catch(err => console.error('Lỗi khi tải hãng:', err));
  }, [productId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setFormData(prev => ({
      ...prev,
      imageFile: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setSuccessMessage('');

    const form = new FormData();
    form.append('name', formData.name);
    form.append('description', formData.description);
    form.append('price', formData.price);
    form.append('category_id', formData.categoryId);
    form.append('brand_id', formData.brandId);

    if (formData.imageFile) {
      form.append('image', formData.imageFile);
    }

    try {
      await axios.put(`http://localhost:8081/api/products/${productId}`, form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccessMessage('✅ Cập nhật sản phẩm thành công!');
      setTimeout(() => navigate('/products'), 1500);
    } catch (error) {
      console.error('Lỗi khi cập nhật sản phẩm:', error);
      setErrors(error.response?.data?.errors || { general: 'Đã xảy ra lỗi khi cập nhật!' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Chỉnh sửa sản phẩm</h2>
      <form onSubmit={handleSubmit}>
        {errors.general && <p className="text-red-500 text-center">{errors.general}</p>}

        {/* Form fields */}
        {[
          { label: 'Tên sản phẩm', name: 'name', type: 'text' },
          { label: 'Mô tả', name: 'description', type: 'text' },
          { label: 'Giá', name: 'price', type: 'number' },
          { label: 'Danh mục', name: 'categoryId', type: 'select', options: categories },
          { label: 'Hãng sản xuất', name: 'brandId', type: 'select', options: brands },
        ].map(({ label, name, type, options }) => (
          <div key={name} className="mb-4">
            <label className="block text-gray-700">{label}</label>
            {type === 'select' ? (
              <select
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${errors[name] ? 'border-red-500' : 'border-gray-300'} rounded-md`}
              >
                <option value="">-- Chọn {label.toLowerCase()} --</option>
                {options.map(option => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${errors[name] ? 'border-red-500' : 'border-gray-300'} rounded-md`}
              />
            )}
            {errors[name] && <p className="text-red-500">{errors[name].join(', ')}</p>}
          </div>
        ))}

        {/* Image upload */}
        <div className="mb-4">
          <label className="block text-gray-700">Ảnh sản phẩm</label>
          <input
            type="file"
            name="imageFile"
            accept="image/*"
            onChange={handleImageChange}
            className={`w-full px-3 py-2 border ${errors.imageFile ? 'border-red-500' : 'border-gray-300'} rounded-md`}
          />
          {errors.imageFile && <p className="text-red-500">{errors.imageFile.join(', ')}</p>}
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-300"
          disabled={loading}
        >
          {loading ? 'Đang cập nhật...' : 'Cập nhật sản phẩm'}
        </button>

        {successMessage && <p className="mt-4 text-green-500 text-center">{successMessage}</p>}
      </form>
    </div>
  );
}

export default EditProduct;
