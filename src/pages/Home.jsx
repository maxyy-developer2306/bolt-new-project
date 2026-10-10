import Calculator from '@/components/Calculator';
import { Sun, Calculator as CalcIcon, Store, TrendingDown, Leaf, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div>
      <section className="bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/20 text-yellow-300 text-sm font-medium mb-4">
              <Sun className="w-4 h-4" />
              Solar Calculator & Marketplace
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              Calculate Your Electricity Usage &
              <span className="text-yellow-400"> Find the Right Solar System</span>
            </h1>
            <p className="mt-4 text-lg text-gray-300 leading-relaxed">
              Estimate your monthly electricity bill, discover how many solar panels
              you need, and browse solar products from sellers across Pakistan.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#calculator"
                className="px-5 py-2.5 rounded-lg font-bold bg-yellow-400 text-navy-900 hover:bg-yellow-300 transition-colors"
              >
                Start Calculating
              </a>
              <Link
                to="/marketplace"
                className="px-5 py-2.5 rounded-lg font-medium border border-gray-400 text-white hover:bg-navy-700 transition-colors"
              >
                Browse Marketplace
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <FeatureCard
            icon={<CalcIcon className="w-6 h-6" />}
            title="Electricity Calculator"
            desc="Add your appliances, adjust usage, and get instant solar recommendations."
          />
          <FeatureCard
            icon={<TrendingDown className="w-6 h-6" />}
            title="Save on Bills"
            desc="See how many solar panels can offset your monthly electricity costs."
          />
          <FeatureCard
            icon={<Store className="w-6 h-6" />}
            title="Solar Marketplace"
            desc="Buy and sell solar panels, inverters, batteries, and accessories."
          />
        </div>

        <div id="calculator" className="scroll-mt-20">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-yellow-400 flex items-center justify-center">
              <CalcIcon className="w-5 h-5 text-navy-900" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-navy-900">
                Electricity & Solar Calculator
              </h2>
              <p className="text-sm text-gray-500">
                Edit values below — results update automatically.
              </p>
            </div>
          </div>
          <Calculator />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          <div className="bg-green-50 rounded-xl p-6 border border-green-200">
            <Leaf className="w-8 h-8 text-green-600 mb-3" />
            <h3 className="font-bold text-green-800 mb-1">Eco-Friendly</h3>
            <p className="text-sm text-green-700">
              Solar energy reduces your carbon footprint and helps Pakistan move
              toward a cleaner future.
            </p>
          </div>
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
            <ShieldCheck className="w-8 h-8 text-blue-600 mb-3" />
            <h3 className="font-bold text-blue-800 mb-1">Secure Platform</h3>
            <p className="text-sm text-blue-700">
              User accounts with hashed passwords and seller-owned product
              listings protected by backend authorization.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="w-12 h-12 rounded-lg bg-navy-900 text-yellow-400 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="font-bold text-navy-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500">{desc}</p>
    </div>
  );
}
