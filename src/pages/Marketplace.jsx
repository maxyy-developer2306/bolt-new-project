import { useState, useEffect, useCallback } from 'react';
import { Search, Store, Loader2, Package, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '@/utils/api';

const CATEGORIES = [
  'All',
  'Solar Panels',
  'Inverters',
  'Batteries',
  'Charge Controllers',
  'Accessories',
  'Other',
];

export default function Marketplace() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (search) params.search = search;
      if (category !== 'All') params.category = category;
      const res = await api.get('/products', { params });
      setProducts(res.data || []);
    } catch (err) {
      const msg = err.response?.data?.message || '';
      if (msg.includes('Network') || !err.response) {
        setError('Cannot connect to the server. The backend must be running to load products.');
      } else {
        setError(msg || 'Failed to load products.');
      }
    }
    setLoading(false);
  }, [search, category]);

  useEffect(() => {
    const timer = setTimeout(fetchProducts, 300);
    return () => clearTimeout(timer);
  }, [fetchProducts]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-yellow-400 flex items-center justify-center">
          <Store className="w-5 h-5 text-navy-900" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Solar Marketplace</h1>
          <p className="text-sm text-gray-500">Browse solar products from sellers across Pakistan</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products by title, brand, or model..."
            className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto">
          <Filter className="w-4 h-4 text-gray-400 shrink-0" />
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                category === cat
                  ? 'bg-navy-900 text-yellow-400'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <Loader2 className="w-8 h-8 animate-spin mb-3" />
          <p className="text-sm">Loading products...</p>
        </div>
      )}

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
          <p className="text-sm text-yellow-700 mb-2">{error}</p>
          <p className="text-xs text-yellow-600">
            Start the backend server (see README) to load real products from MongoDB.
          </p>
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <div className="text-center py-20">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No products found</p>
          <p className="text-sm text-gray-400 mt-1">
            Try adjusting your search or filters, or check back later.
          </p>
        </div>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {products.map((product) => (
            <Link
              key={product._id}
              to={`/products/${product._id}`}
              className="group bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all"
            >
              <div className="aspect-square bg-gray-100 overflow-hidden">
                {product.images?.[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-12 h-12 text-gray-300" />
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="text-xs font-medium text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded">
                    {product.category}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded ${
                      product.condition === 'new'
                        ? 'bg-green-50 text-green-600'
                        : 'bg-blue-50 text-blue-600'
                    }`}
                  >
                    {product.condition || 'N/A'}
                  </span>
                </div>
                <h3 className="font-semibold text-navy-900 text-sm leading-snug group-hover:text-yellow-600 transition-colors line-clamp-2">
                  {product.title}
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  {product.brand && `${product.brand} · `}
                  {product.location || 'Pakistan'}
                </p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-lg font-bold text-navy-900">
                    Rs {Number(product.price).toLocaleString()}
                  </span>
                  {product.quantity > 0 ? (
                    <span className="text-xs text-green-600 font-medium">In Stock</span>
                  ) : (
                    <span className="text-xs text-red-500 font-medium">Out of Stock</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
