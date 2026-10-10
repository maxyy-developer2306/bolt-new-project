import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sun, User, Mail, Lock, Phone, MapPin, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    location: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone,
        location: form.location,
      });
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Check your connection.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-navy-900 text-yellow-400 mb-3">
              <Sun className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold text-navy-900">Create Account</h1>
            <p className="text-sm text-gray-500 mt-1">Join the solar marketplace</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <InputField icon={<User className="w-4 h-4" />} label="Full Name" name="name" value={form.name} onChange={handleChange} required placeholder="Your name" />
            <InputField icon={<Mail className="w-4 h-4" />} label="Email" name="email" type="email" value={form.email} onChange={handleChange} required placeholder="you@example.com" />
            <InputField icon={<Lock className="w-4 h-4" />} label="Password" name="password" type="password" value={form.password} onChange={handleChange} required placeholder="At least 6 characters" />
            <InputField icon={<Lock className="w-4 h-4" />} label="Confirm Password" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} required placeholder="Re-enter password" />
            <InputField icon={<Phone className="w-4 h-4" />} label="Phone (optional)" name="phone" value={form.phone} onChange={handleChange} placeholder="+92 300 1234567" />
            <InputField icon={<MapPin className="w-4 h-4" />} label="Location (optional)" name="location" value={form.location} onChange={handleChange} placeholder="City, Pakistan" />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg font-bold bg-yellow-400 text-navy-900 hover:bg-yellow-300 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-navy-700 font-semibold hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function InputField({ icon, label, name, type = 'text', value, onChange, required, placeholder }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>
        <input
          type={type}
          name={name}
          required={required}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
      </div>
    </div>
  );
}
