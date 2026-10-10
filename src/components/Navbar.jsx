import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Sun, Menu, X, User, LogOut, Shield, Store, Calculator, Info, HelpCircle } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate('/');
  };

  const navLinkClass = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'bg-yellow-400 text-navy-900'
        : 'text-gray-200 hover:bg-navy-700 hover:text-yellow-300'
    }`;

  const link = (to, label, icon) => (
    <NavLink to={to} className={navLinkClass} onClick={() => setOpen(false)}>
      <span className="flex items-center gap-1.5">
        {icon}
        {label}
      </span>
    </NavLink>
  );

  return (
    <nav className="bg-navy-900 text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <Sun className="w-7 h-7 text-yellow-400" />
            <span className="text-lg font-bold tracking-tight">
              Solar<span className="text-yellow-400">System</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {link('/', 'Home', <Calculator className="w-4 h-4" />)}
            {link('/how-it-works', 'How It Works', <Info className="w-4 h-4" />)}
            {link('/marketplace', 'Marketplace', <Store className="w-4 h-4" />)}
            {link('/faq', 'FAQ', <HelpCircle className="w-4 h-4" />)}
          </div>

          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                <NavLink
                  to="/profile"
                  className={navLinkClass}
                >
                  <span className="flex items-center gap-1.5">
                    <User className="w-4 h-4" />
                    {user.name?.split(' ')[0] || 'Profile'}
                  </span>
                </NavLink>
                {isAdmin && (
                  <NavLink to="/admin" className={navLinkClass}>
                    <span className="flex items-center gap-1.5">
                      <Shield className="w-4 h-4" />
                      Admin
                    </span>
                  </NavLink>
                )}
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-lg text-sm font-medium bg-red-500 hover:bg-red-600 text-white transition-colors flex items-center gap-1.5"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white border border-gray-500 hover:bg-navy-700 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-lg text-sm font-bold bg-yellow-400 text-navy-900 hover:bg-yellow-300 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-navy-700"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-navy-800 border-t border-navy-700 px-4 py-3 space-y-1">
          {link('/', 'Home', <Calculator className="w-4 h-4" />)}
          {link('/how-it-works', 'How It Works', <Info className="w-4 h-4" />)}
          {link('/marketplace', 'Marketplace', <Store className="w-4 h-4" />)}
          {link('/faq', 'FAQ', <HelpCircle className="w-4 h-4" />)}
          <div className="pt-2 border-t border-navy-700 space-y-1">
            {user ? (
              <>
                {link('/profile', user.name?.split(' ')[0] || 'Profile', <User className="w-4 h-4" />)}
                {isAdmin && link('/admin', 'Admin', <Shield className="w-4 h-4" />)}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium bg-red-500 text-white flex items-center gap-1.5"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <div className="flex gap-2 pt-1">
                <Link
                  to="/login"
                  className="flex-1 text-center px-4 py-2 rounded-lg text-sm font-medium border border-gray-500 text-white"
                  onClick={() => setOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="flex-1 text-center px-4 py-2 rounded-lg text-sm font-bold bg-yellow-400 text-navy-900"
                  onClick={() => setOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
