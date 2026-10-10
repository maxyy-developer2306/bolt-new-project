import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Package, MapPin, User, Loader2, AlertCircle,
  Tag, Boxes, Phone, Mail,
} from 'lucide-react';
import api from '@/utils/api';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        if (!err.response) {
          setError('Cannot connect to the server. The backend must be running.');
        } else {
          setError(err.response?.data?.message || 'Product not found.');
        }
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <Loader2 className="w-8 h-8 animate-spin mb-3" />
        <p className="text-sm">Loading product...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
          <AlertCircle className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
          <p className="text-sm text-yellow-700 mb-4">{error}</p>
          <button
            onClick={() => navigate('/marketplace')}
            className="px-4 py-2 rounded-lg font-medium bg-navy-900 text-white text-sm hover:bg-navy-800"
          >
            Back to Marketplace
          </button>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <Link
        to="/marketplace"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-navy-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Marketplace
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
            {product.images?.[activeImage] ? (
              <img
                src={product.images[activeImage]}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="w-16 h-16 text-gray-300" />
              </div>
            )}
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 shrink-0 ${
                    activeImage === i ? 'border-yellow-400' : 'border-gray-200'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
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

          <h1 className="text-2xl font-bold text-navy-900 mb-2">{product.title}</h1>

          <p className="text-3xl font-bold text-navy-900 mb-4">
            Rs {Number(product.price).toLocaleString()}
          </p>

          <div className="grid grid-cols-2 gap-3 mb-4">
            {product.brand && (
              <InfoItem icon={<Tag className="w-4 h-4" />} label="Brand" value={product.brand} />
            )}
            {product.model && (
              <InfoItem icon={<Tag className="w-4 h-4" />} label="Model" value={product.model} />
            )}
            {product.wattage && (
              <InfoItem icon={<Package className="w-4 h-4" />} label="Wattage" value={`${product.wattage} W`} />
            )}
            <InfoItem
              icon={<Boxes className="w-4 h-4" />}
              label="Quantity"
              value={`${product.quantity || 0} available`}
            />
          </div>

          {product.description && (
            <div className="mb-4">
              <h3 className="text-sm font-bold text-gray-700 mb-1">Description</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
            </div>
          )}

          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-sm font-bold text-gray-700 mb-3">Seller Information</h3>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-navy-900 text-yellow-400 flex items-center justify-center font-bold">
                {product.seller?.name?.charAt(0).toUpperCase() || 'S'}
              </div>
              <div>
                <p className="text-sm font-semibold text-navy-900">
                  {product.seller?.name || 'Unknown seller'}
                </p>
                {product.location && (
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {product.location}
                  </p>
                )}
              </div>
            </div>
            {product.seller?.phone && (
              <p className="text-xs text-gray-500 flex items-center gap-1.5 mb-1">
                <Phone className="w-3.5 h-3.5" />
                {product.seller.phone}
              </p>
            )}
            {product.seller?.email && (
              <p className="text-xs text-gray-500 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                {product.seller.email}
              </p>
            )}
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg text-xs text-blue-600">
            No payment system is currently implemented. Contact the seller directly
            to arrange a purchase.
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon, label, value }) {
  return (
    <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-2.5">
      <span className="text-gray-400">{icon}</span>
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm font-medium text-gray-700">{value}</p>
      </div>
    </div>
  );
}
