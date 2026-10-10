import { Link } from 'react-router-dom';
import { Sun, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-navy-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sun className="w-6 h-6 text-yellow-400" />
              <span className="text-lg font-bold text-white">
                Solar<span className="text-yellow-400">System</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              Calculate your household electricity usage, get solar system
              recommendations, and buy or sell solar products in Pakistan.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-yellow-300 transition-colors">
                  Solar Calculator
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-yellow-300 transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/marketplace" className="hover:text-yellow-300 transition-colors">
                  Marketplace
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-yellow-300 transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
              Contact
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-yellow-400" />
                support@solarsystem.pk
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-yellow-400" />
                +92 300 1234567
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-yellow-400" />
                Islamabad, Pakistan
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-navy-700 mt-8 pt-6 text-center text-sm text-gray-500">
          <p>
            Solar generation values are estimates based on 5 peak sun hours and
            80% system efficiency. Actual results vary by location, weather, and
            installation.
          </p>
          <p className="mt-2">
            &copy; {new Date().getFullYear()} SolarSystem.pk — All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
