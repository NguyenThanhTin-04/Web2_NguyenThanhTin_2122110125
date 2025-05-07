import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const API_URL = 'http://localhost:8081/api/categories';

function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [categoryToEdit, setCategoryToEdit] = useState(null);

  const token = localStorage.getItem('token');

  // Load danh sách
  const fetchCategories = async () => {
    try {
      const res = await axios.get(API_URL);
      setCategories(res.data);
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to fetch categories', 'error');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      Swal.fire('Warning', 'Category name is required', 'warning');
      return;
    }

    try {
      if (categoryToEdit) {
        // Update
        await axios.put(`${API_URL}/${categoryToEdit.id}`, { name: categoryName }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        Swal.fire('Success', 'Category updated', 'success');
      } else {
        // Add
        await axios.post(API_URL, { name: categoryName }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        Swal.fire('Success', 'Category added', 'success');
      }

      setCategoryName('');
      setCategoryToEdit(null);
      fetchCategories();
    } catch (err) {
      console.error(err);
      Swal.fire('Error', err.response?.data?.message || 'Operation failed', 'error');
    }
  };

  // Xoá
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will delete the category permanently!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`${API_URL}/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        Swal.fire('Deleted!', 'Category has been deleted.', 'success');
        fetchCategories();
      } catch (err) {
        console.error(err);
        Swal.fire('Error', 'Delete failed', 'error');
      }
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Category Management</h2>

      <form onSubmit={handleSubmit} className="mb-6">
        <input
          type="text"
          placeholder="Category name"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          className="border p-2 mr-4"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          {categoryToEdit ? 'Update' : 'Add'}
        </button>
        {categoryToEdit && (
          <button
            type="button"
            className="ml-2 bg-gray-500 text-white px-4 py-2 rounded"
            onClick={() => {
              setCategoryToEdit(null);
              setCategoryName('');
            }}
          >
            Cancel
          </button>
        )}
      </form>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full table-auto text-left">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 ? (
              categories.map((cat) => (
                <tr key={cat.id} className="border-b">
                  <td className="px-4 py-2">{cat.id}</td>
                  <td className="px-4 py-2">{cat.name}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => {
                        setCategoryToEdit(cat);
                        setCategoryName(cat.name);
                      }}
                      className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center py-4">No categories available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CategoryManagement;
