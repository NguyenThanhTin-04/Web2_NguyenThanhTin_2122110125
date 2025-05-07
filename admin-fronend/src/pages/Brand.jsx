import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const API_URL = 'http://localhost:8081/api/brands';

function BrandManagement() {
  const [brands, setBrands] = useState([]);
  const [brandName, setBrandName] = useState('');
  const [brandToEdit, setBrandToEdit] = useState(null);

  const token = localStorage.getItem('token');

  const fetchBrands = async () => {
    try {
      const res = await axios.get(API_URL);
      setBrands(res.data);
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to fetch brands', 'error');
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!brandName.trim()) {
      Swal.fire('Warning', 'Brand name is required', 'warning');
      return;
    }

    try {
      if (brandToEdit) {
        await axios.put(`${API_URL}/${brandToEdit.id}`, { name: brandName }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        Swal.fire('Success', 'Brand updated', 'success');
      } else {
        await axios.post(API_URL, { name: brandName }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        Swal.fire('Success', 'Brand added', 'success');
      }

      setBrandName('');
      setBrandToEdit(null);
      fetchBrands();
    } catch (err) {
      console.error(err);
      Swal.fire('Error', err.response?.data?.message || 'Operation failed', 'error');
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will delete the brand permanently!',
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
        Swal.fire('Deleted!', 'Brand has been deleted.', 'success');
        fetchBrands();
      } catch (err) {
        console.error(err);
        Swal.fire('Error', 'Delete failed', 'error');
      }
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Brand Management</h2>

      <form onSubmit={handleSubmit} className="mb-6">
        <input
          type="text"
          placeholder="Brand name"
          value={brandName}
          onChange={(e) => setBrandName(e.target.value)}
          className="border p-2 mr-4"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          {brandToEdit ? 'Update' : 'Add'}
        </button>
        {brandToEdit && (
          <button
            type="button"
            className="ml-2 bg-gray-500 text-white px-4 py-2 rounded"
            onClick={() => {
              setBrandToEdit(null);
              setBrandName('');
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
            {brands.length > 0 ? (
              brands.map((brand) => (
                <tr key={brand.id} className="border-b">
                  <td className="px-4 py-2">{brand.id}</td>
                  <td className="px-4 py-2">{brand.name}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => {
                        setBrandToEdit(brand);
                        setBrandName(brand.name);
                      }}
                      className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(brand.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center py-4">No brands available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BrandManagement;
