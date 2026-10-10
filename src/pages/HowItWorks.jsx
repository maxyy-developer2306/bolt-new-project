import { Calculator, Search, ShoppingCart, Sun } from 'lucide-react';

const STEPS = [
  {
    icon: <Calculator className="w-7 h-7" />,
    title: '1. Calculate Your Usage',
    desc: 'Add your household appliances, set wattage, quantity, and usage hours. The calculator instantly shows your monthly electricity consumption and estimated bill.',
  },
  {
    icon: <Sun className="w-7 h-7" />,
    title: '2. Get Solar Recommendations',
    desc: 'Based on your daily usage, peak sun hours (5), and system efficiency (80%), we recommend the right solar capacity and number of 550W panels for your home.',
  },
  {
    icon: <Search className="w-7 h-7" />,
    title: '3. Browse the Marketplace',
    desc: 'Search and filter solar products by category, price, and condition. Compare panels, inverters, batteries, and accessories from sellers across Pakistan.',
  },
  {
    icon: <ShoppingCart className="w-7 h-7" />,
    title: '4. List Your Products',
    desc: 'Registered users can list their own solar products for sale. Add product details, images, pricing, and manage your listings from your seller dashboard.',
  },
];

export default function HowItWorks() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-navy-900 mb-3">How It Works</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Four simple steps to understand your electricity usage, find the right
          solar system, and participate in the solar marketplace.
        </p>
      </div>

      <div className="space-y-6">
        {STEPS.map((step, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex gap-5"
          >
            <div className="w-14 h-14 rounded-xl bg-yellow-400 text-navy-900 flex items-center justify-center shrink-0">
              {step.icon}
            </div>
            <div>
              <h2 className="text-lg font-bold text-navy-900 mb-1">{step.title}</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-navy-900 rounded-xl p-8 text-center text-white">
        <h2 className="text-xl font-bold mb-2">Ready to get started?</h2>
        <p className="text-gray-300 text-sm mb-4">
          Use the calculator now or browse the marketplace.
        </p>
        <div className="flex justify-center gap-3">
          <a
            href="/#calculator"
            className="px-5 py-2.5 rounded-lg font-bold bg-yellow-400 text-navy-900 hover:bg-yellow-300 transition-colors"
          >
            Use Calculator
          </a>
          <a
            href="/marketplace"
            className="px-5 py-2.5 rounded-lg font-medium border border-gray-400 hover:bg-navy-700 transition-colors"
          >
            Browse Marketplace
          </a>
        </div>
      </div>
    </div>
  );
}
