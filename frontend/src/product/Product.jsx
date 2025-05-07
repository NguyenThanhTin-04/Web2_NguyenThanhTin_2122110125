import { useEffect, useState } from 'react';
import axios from 'axios';
import { Heart, ShoppingCart, Eye, Loader, Search, Filter, Tag, SlidersHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Product() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const productsPerPage = 8;

  // Fetch all data (products and categories)
  useEffect(() => {
    fetchAllData();
  }, []);

  // Fetch products based on selected category
  useEffect(() => {
    if (selectedCategory) {
      fetchByCategory(selectedCategory);
    } else {
      fetchAllData();
    }
  }, [selectedCategory]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [productRes, categoryRes] = await Promise.all([
        axios.get('http://localhost:8081/api/products'),
        axios.get('http://localhost:8081/api/categories'),
      ]);
      setProducts(productRes.data);
      setCategories(categoryRes.data);
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchByCategory = async (categoryId) => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:8081/api/categories/${categoryId}`);

      // Trích xuất danh sách sản phẩm từ res.data
      if (res.data && Array.isArray(res.data.products)) {
        setProducts(res.data.products); // Set danh sách sản phẩm của danh mục
      } else {
        setProducts([]); // Nếu không có sản phẩm
      }
    } catch (err) {
      console.error('Lỗi khi lọc theo danh mục:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
  };

  const filteredProducts = products
    .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(p => (!minPrice || p.price >= parseInt(minPrice)) && (!maxPrice || p.price <= parseInt(maxPrice)))
    .sort((a, b) => sortOrder === 'asc' ? a.price - b.price : b.price - a.price);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const currentProducts = filteredProducts.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage);

  const handleClickDetail = (id) => {
    navigate(`/product/${id}`);
  };

  const renderPaginationNumbers = () => {
    return Array.from({ length: totalPages }, (_, i) => (
      <button
        key={i}
        onClick={() => setCurrentPage(i + 1)}
        className={`px-4 py-2 rounded-lg border transition-all duration-200 ${
          currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-blue-50'
        }`}
      >
        {i + 1}
      </button>
    ));
  };

  return (
    <div className="bg-gradient-to-b from-white to-gray-100 min-h-screen py-10 px-6 sm:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto space-y-10">
        <h1 className="text-2xl font-extrabold text-gray-800 text-center mb-10">🛍️ Khám Phá Sản Phẩm Hot Nhất</h1>

        {/* Tìm kiếm */}
        <div className="flex justify-center items-center mb-8">
          <div className="relative w-full md:w-1/2">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Tìm kiếm sản phẩm..."
              className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-300 focus:ring-purple-500 text-lg"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </div>

        {/* Bộ lọc */}
        <div className="flex justify-center items-center gap-4 mb-8">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2 px-4 py-2 border rounded-full hover:bg-gray-50"
          >
            <Filter size={18} />
            <span className="font-bold text-lg">Bộ lọc</span>
          </button>

          <select
            value={sortOrder}
            onChange={handleSortChange}
            className="px-4 py-2 border rounded-full focus:ring-purple-500 font-bold text-lg"
          >
            <option value="asc">Giá tăng dần</option>
            <option value="desc">Giá giảm dần</option>
          </select>
        </div>

        {/* Mở rộng bộ lọc */}
        <div className={`bg-white rounded-xl shadow-md p-6 mb-8 transition-all duration-300 ${isFilterOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <Tag size={18} />
                Danh mục
              </h3>
              <select
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="w-full p-2 border rounded-md focus:ring-purple-500"
              >
                <option value="">Tất cả danh mục</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <SlidersHorizontal size={18} />
                Khoảng giá
              </h3>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => {
                    setMinPrice(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Giá từ..."
                  className="flex-1 p-2 border rounded-md"
                />
                <span>-</span>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => {
                    setMaxPrice(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Đến..."
                  className="flex-1 p-2 border rounded-md"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Hiển thị số lượng kết quả */}
        <div className="mb-6 flex justify-between items-center">
          <p className="font-bold text-lg text-gray-600">
            Hiển thị <span className="font-semibold">{filteredProducts.length}</span> sản phẩm
          </p>
          {(selectedCategory || searchTerm || minPrice || maxPrice) && (
            <button
              onClick={() => {
                setSelectedCategory('');
                setSearchTerm('');
                setMinPrice('');
                setMaxPrice('');
                setCurrentPage(1);
              }}
              className="text-purple-600 hover:text-purple-800 text-sm font-medium"
            >
              Xóa bộ lọc
            </button>
          )}
        </div>

        {/* Danh sách sản phẩm */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader className="animate-spin w-14 h-14 text-blue-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
            {currentProducts.length > 0 ? (
              currentProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-2xl shadow group relative">
                  <div className="relative">
                    <img
                      src={`http://localhost:8081/images/${product.image}`}
                      alt={product.name}
                      className="w-full h-64 object-cover rounded-t-2xl"
                    />
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                      -15%
                    </span>
                    <button className="absolute top-2 right-2 p-2 bg-white rounded-full hover:bg-pink-100">
                      <Heart className="text-red-500 w-5 h-5" />
                    </button>
                  </div>
                  <div className="p-4 space-y-2">
                    <h3 className="font-semibold text-gray-800 text-base line-clamp-2">{product.name}</h3>
                    <p className="text-sm text-gray-600">Category: {product.category.name}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-purple-600">
                        {new Intl.NumberFormat().format(product.price)} VND
                      </span>
                      <button
                        onClick={() => handleClickDetail(product.id)}
                        className="text-purple-600 hover:text-purple-800"
                      >
                        <Eye size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="col-span-full text-center text-lg text-gray-600">Không có sản phẩm nào.</p>
            )}
          </div>
        )}

        {/* Phân trang */}
        <div className="flex justify-center gap-4 mt-8">
          {renderPaginationNumbers()}
        </div>
      </div>
    </div>
  );
}

export default Product;
