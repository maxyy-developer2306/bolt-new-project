import { useState, useEffect, useCallback } from 'react';
import {
  User, Mail, Phone, MapPin, FileText, Camera, Save, Loader2,
  Package, Plus, Pencil, Trash2, AlertCircle, X, Check,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import api from '@/utils/api';

const CATEGORIES = [
  'Solar Panels',
  'Inverters',
  'Batteries',
  'Charge Controllers',
  'Accessories',
  'Other',
];

export default function Profile() {
  const { user, updateUser, fetchProfile } = useAuth();
  const [tab, setTab] = useState('profile');
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    location: user?.location || '',
    description: user?.description || '',
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');

  const fetchProducts = useCallback(async () => {
    setProductsLoading(true);
    try {
      const res = await api.get('/products/my');
      setProducts(res.data || []);
    } catch {
      setProducts([]);
    }
    setProductsLoading(false);
  }, []);

  useEffect(() => {
    if (tab === 'products') fetchProducts();
  }, [tab, fetchProducts]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg('');
    try {
      const res = await api.put('/auth/profile', profileForm);
      updateUser(res.data);
      setProfileMsg('Profile updated successfully.');
    } catch (err) {
      setProfileMsg(err.response?.data?.message || 'Failed to update profile.');
    }
    setSavingProfile(false);
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/products/${productId}`);
      setProducts((prev) => prev.filter((p) => p._id !== productId));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete product.');
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-navy-900 text-yellow-400 flex items-center justify-center text-2xl font-bold">
          {user.profileImage ? (
            <img src={user.profileImage} alt="" className="w-full h-full rounded-full object-cover" />
          ) : (
            user.name?.charAt(0).toUpperCase() || 'U'
          )}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-navy-900">{user.name}</h1>
          <p className="text-sm text-gray-500">{user.email}</p>
          {user.role === 'admin' && (
            <span className="inline-block mt-1 text-xs font-medium bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">
              Administrator
            </span>
          )}
        </div>
      </div>

      <div className="flex gap-2 border-b border-gray-200 mb-6">
        <TabButton active={tab === 'profile'} onClick={() => setTab('profile')}>
          <User className="w-4 h-4" /> Profile
        </TabButton>
        <TabButton active={tab === 'products'} onClick={() => setTab('products')}>
          <Package className="w-4 h-4" /> My Products ({products.length})
        </TabButton>
      </div>

      {tab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm max-w-2xl space-y-4">
          {profileMsg && (
            <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${
              profileMsg.includes('success') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
            }`}>
              {profileMsg.includes('success') ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              {profileMsg}
            </div>
          )}

          <Field label="Full Name" icon={<User className="w-4 h-4" />}>
            <input
              type="text"
              value={profileForm.name}
              onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
              className="input"
            />
          </Field>

          <Field label="Email (read only)" icon={<Mail className="w-4 h-4" />}>
            <input type="email" value={user.email} disabled className="input bg-gray-100" />
          </Field>

          <Field label="Phone" icon={<Phone className="w-4 h-4" />}>
            <input
              type="text"
              value={profileForm.phone}
              onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
              className="input"
              placeholder="+92 300 1234567"
            />
          </Field>

          <Field label="Location" icon={<MapPin className="w-4 h-4" />}>
            <input
              type="text"
              value={profileForm.location}
              onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
              className="input"
              placeholder="City, Pakistan"
            />
          </Field>

          <Field label="Short Description" icon={<FileText className="w-4 h-4" />}>
            <textarea
              rows={3}
              value={profileForm.description}
              onChange={(e) => setProfileForm({ ...profileForm, description: e.target.value })}
              className="input resize-none"
              placeholder="Tell buyers about yourself..."
            />
          </Field>

          <button
            type="submit"
            disabled={savingProfile}
            className="px-5 py-2.5 rounded-lg font-bold bg-yellow-400 text-navy-900 hover:bg-yellow-300 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {savingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
        </form>
      )}

      {tab === 'products' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-navy-900">My Product Listings</h2>
            <button
              onClick={() => { setEditingProduct(null); setShowProductForm(true); }}
              className="px-4 py-2 rounded-lg font-bold text-sm bg-navy-900 text-white hover:bg-navy-800 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </button>
          </div>

          {productsLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No products listed yet</p>
              <p className="text-sm text-gray-400 mt-1">Click "Add Product" to create your first listing.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((p) => (
                <div key={p._id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                  <div className="aspect-square bg-gray-100">
                    {p.images?.[0] ? (
                      <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-10 h-10 text-gray-300" />
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="text-xs text-yellow-600 bg-yellow-50 px-1.5 py-0.5 rounded">{p.category}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded ${
                        p.status === 'approved' ? 'bg-green-50 text-green-600'
                        : p.status === 'rejected' ? 'bg-red-50 text-red-600'
                        : 'bg-orange-50 text-orange-600'
                      }`}>
                        {p.status || 'pending'}
                      </span>
                    </div>
                    <h3 className="font-semibold text-sm text-navy-900 line-clamp-1">{p.title}</h3>
                    <p className="text-lg font-bold text-navy-900 mt-1">Rs {Number(p.price).toLocaleString()}</p>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleEditProduct(p)}
                        className="flex-1 py-1.5 rounded-lg text-xs font-medium bg-gray-100 hover:bg-gray-200 flex items-center justify-center gap-1"
                      >
                        <Pencil className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p._id)}
                        className="flex-1 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {showProductForm && (
        <ProductForm
          product={editingProduct}
          onClose={() => { setShowProductForm(false); setEditingProduct(null); }}
          onSaved={() => { setShowProductForm(false); setEditingProduct(null); fetchProducts(); }}
        />
      )}
    </div>
  );
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
        active
          ? 'border-yellow-400 text-navy-900'
          : 'border-transparent text-gray-500 hover:text-navy-700'
      }`}
    >
      {children}
    </button>
  );
}

function Field({ label, icon, children }) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-sm font-medium text-gray-600 mb-1">
        <span className="text-gray-400">{icon}</span>
        {label}
      </label>
      {children}
    </div>
  );
}

function ProductForm({ product, onClose, onSaved }) {
  const isEdit = !!product;
  const [form, setForm] = useState({
    title: product?.title || '',
    category: product?.category || 'Solar Panels',
    price: product?.price || '',
    description: product?.description || '',
    brand: product?.brand || '',
    model: product?.model || '',
    wattage: product?.wattage || '',
    condition: product?.condition || 'new',
    quantity: product?.quantity || 1,
    location: product?.location || '',
    images: product?.images?.join('\n') || '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const images = form.images
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const data = {
      ...form,
      price: Number(form.price) || 0,
      wattage: form.wattage ? Number(form.wattage) : undefined,
      quantity: Number(form.quantity) || 0,
      images,
    };

    try {
      if (isEdit) {
        await api.put(`/products/${product._id}`, data);
      } else {
        await api.post('/products', data);
      }
      onSaved();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product.');
    }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full my-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-gray-200 sticky top-0 bg-white rounded-t-2xl z-10">
          <h2 className="text-lg font-bold text-navy-900">
            {isEdit ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <input name="title" value={form.title} onChange={handleChange} placeholder="Product title" required className="input" />

          <div className="grid grid-cols-2 gap-3">
            <select name="category" value={form.category} onChange={handleChange} className="input">
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select name="condition" value={form.condition} onChange={handleChange} className="input">
              <option value="new">New</option>
              <option value="used">Used</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input name="price" type="number" min="0" value={form.price} onChange={handleChange} placeholder="Price (PKR)" required className="input" />
            <input name="quantity" type="number" min="0" value={form.quantity} onChange={handleChange} placeholder="Quantity" required className="input" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input name="brand" value={form.brand} onChange={handleChange} placeholder="Brand" className="input" />
            <input name="model" value={form.model} onChange={handleChange} placeholder="Model" className="input" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input name="wattage" type="number" min="0" value={form.wattage} onChange={handleChange} placeholder="Wattage (W)" className="input" />
            <input name="location" value={form.location} onChange={handleChange} placeholder="Location" className="input" />
          </div>

          <textarea name="description" rows={3} value={form.description} onChange={handleChange} placeholder="Product description" className="input resize-none" />

          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 block">
              Image URLs (one per line)
            </label>
            <textarea
              rows={3}
              value={form.images}
              onChange={handleChange}
              placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
              className="input resize-none text-xs"
            />
            <p className="text-xs text-gray-400 mt-1">
              Paste direct image URLs, one per line. You can use image hosting services.
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 rounded-lg font-bold bg-yellow-400 text-navy-900 hover:bg-yellow-300 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isEdit ? 'Update Product' : 'Add Product'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg font-medium bg-gray-100 hover:bg-gray-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
