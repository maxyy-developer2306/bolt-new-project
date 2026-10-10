import { useState, useEffect, useCallback } from 'react';
import {
  Shield, Users, Package, BarChart3, Check, X, Ban, RotateCcw,
  Loader2, AlertCircle, Trash2,
} from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import api from '@/utils/api';

export default function Admin() {
  const { user, isAdmin, loading } = useAuth();
  const [tab, setTab] = useState('stats');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchStats = useCallback(async () => {
    try {
      const res = await api.get('/admin/stats');
      setStats(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load stats.');
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users.');
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await api.get('/admin/products');
      setProducts(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load products.');
    }
  }, []);

  useEffect(() => {
    if (!isAdmin) return;
    setError('');
    setDataLoading(true);
    if (tab === 'stats') fetchStats();
    if (tab === 'users') fetchUsers();
    if (tab === 'products') fetchProducts();
    setDataLoading(false);
  }, [tab, isAdmin, fetchStats, fetchUsers, fetchProducts]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  const handleProductStatus = async (id, status) => {
    try {
      await api.put(`/admin/products/${id}/status`, { status });
      setProducts((prev) => prev.map((p) => (p._id === id ? { ...p, status } : p)));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update product status.');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('Remove this product listing?')) return;
    try {
      await api.delete(`/admin/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to remove product.');
    }
  };

  const handleUserStatus = async (id, action) => {
    try {
      await api.put(`/admin/users/${id}/${action}`);
      setUsers((prev) =>
        prev.map((u) =>
          u._id === id ? { ...u, status: action === 'suspend' ? 'suspended' : 'active' } : u
        )
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-navy-900 flex items-center justify-center">
          <Shield className="w-5 h-5 text-yellow-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-500">Manage users, products, and platform activity</p>
        </div>
      </div>

      <div className="flex gap-2 border-b border-gray-200 mb-6 overflow-x-auto">
        <AdminTab active={tab === 'stats'} onClick={() => setTab('stats')} icon={<BarChart3 className="w-4 h-4" />}>
          Statistics
        </AdminTab>
        <AdminTab active={tab === 'users'} onClick={() => setTab('users')} icon={<Users className="w-4 h-4" />}>
          Users
        </AdminTab>
        <AdminTab active={tab === 'products'} onClick={() => setTab('products')} icon={<Package className="w-4 h-4" />}>
          Products
        </AdminTab>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex gap-2">
          <AlertCircle className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
          <p className="text-sm text-yellow-700">{error}</p>
        </div>
      )}

      {dataLoading && (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      )}

      {tab === 'stats' && stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Users" value={stats.users || 0} icon={<Users className="w-5 h-5" />} />
          <StatCard label="Total Products" value={stats.products || 0} icon={<Package className="w-5 h-5" />} />
          <StatCard label="Pending Listings" value={stats.pendingProducts || 0} icon={<AlertCircle className="w-5 h-5" />} />
          <StatCard label="Active Sellers" value={stats.activeSellers || 0} icon={<BarChart3 className="w-5 h-5" />} />
        </div>
      )}

      {tab === 'users' && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="text-left p-3 font-medium">Name</th>
                <th className="text-left p-3 font-medium hidden sm:table-cell">Email</th>
                <th className="text-left p-3 font-medium hidden md:table-cell">Role</th>
                <th className="text-left p-3 font-medium">Status</th>
                <th className="text-right p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50">
                  <td className="p-3 font-medium text-navy-900">{u.name}</td>
                  <td className="p-3 text-gray-600 hidden sm:table-cell">{u.email}</td>
                  <td className="p-3 hidden md:table-cell">
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      u.role === 'admin' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`text-xs font-medium ${
                      u.status === 'suspended' ? 'text-red-500' : 'text-green-600'
                    }`}>
                      {u.status || 'active'}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    {u.role !== 'admin' && (
                      u.status === 'suspended' ? (
                        <button
                          onClick={() => handleUserStatus(u._id, 'reactivate')}
                          className="px-2 py-1 rounded text-xs font-medium bg-green-50 text-green-600 hover:bg-green-100 inline-flex items-center gap-1"
                        >
                          <RotateCcw className="w-3 h-3" /> Reactivate
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUserStatus(u._id, 'suspend')}
                          className="px-2 py-1 rounded text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 inline-flex items-center gap-1"
                        >
                          <Ban className="w-3 h-3" /> Suspend
                        </button>
                      )
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <p className="text-center text-gray-400 py-8 text-sm">No users found.</p>
          )}
        </div>
      )}

      {tab === 'products' && (
        <div className="space-y-3">
          {products.map((p) => (
            <div key={p._id} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex items-center gap-4">
              <div className="w-14 h-14 rounded-lg bg-gray-100 shrink-0 overflow-hidden">
                {p.images?.[0] ? (
                  <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                ) : (
                  <Package className="w-6 h-6 text-gray-300 m-auto mt-4" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm text-navy-900 truncate">{p.title}</h3>
                <p className="text-xs text-gray-500">
                  Rs {Number(p.price).toLocaleString()} · {p.category} · by {p.seller?.name || 'Unknown'}
                </p>
                <span className={`text-xs font-medium ${
                  p.status === 'approved' ? 'text-green-600'
                  : p.status === 'rejected' ? 'text-red-500'
                  : 'text-orange-500'
                }`}>
                  {p.status || 'pending'}
                </span>
              </div>
              <div className="flex gap-1.5 shrink-0">
                {p.status !== 'approved' && (
                  <button onClick={() => handleProductStatus(p._id, 'approved')} className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100" title="Approve">
                    <Check className="w-4 h-4" />
                  </button>
                )}
                {p.status !== 'rejected' && (
                  <button onClick={() => handleProductStatus(p._id, 'rejected')} className="p-2 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100" title="Reject">
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button onClick={() => handleDeleteProduct(p._id)} className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100" title="Remove">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {products.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No products found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function AdminTab({ active, onClick, icon, children }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
        active ? 'border-yellow-400 text-navy-900' : 'border-transparent text-gray-500 hover:text-navy-700'
      }`}
    >
      {icon}
      {children}
    </button>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <div className="w-10 h-10 rounded-lg bg-navy-900 text-yellow-400 flex items-center justify-center mb-3">
        {icon}
      </div>
      <p className="text-2xl font-bold text-navy-900">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}
