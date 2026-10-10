import { HelpCircle } from 'lucide-react';

const FAQS = [
  {
    q: 'How is my monthly electricity bill estimated?',
    a: 'We multiply your total monthly units (kWh) by the rate per unit (default Rs 50). This is an approximate estimate and does not include actual tariff slabs, taxes, fuel adjustments, or other charges that your utility company may apply.',
  },
  {
    q: 'How is the recommended solar system size calculated?',
    a: 'We take your daily usage in kWh, divide by 5 peak sun hours and 80% system efficiency to get the recommended system capacity in kW. This gives an estimate of the system size needed to cover your daily consumption.',
  },
  {
    q: 'How many solar panels do I need?',
    a: 'We divide the recommended system capacity by 0.55 kW (550W per panel) and round up to the next whole panel. For example, a 3 kW system needs about 6 panels, a 5 kW system needs about 10 panels.',
  },
  {
    q: 'Are the solar generation values guaranteed?',
    a: 'No. Generation values are estimates based on 5 peak sun hours and 80% system efficiency. Actual output varies by location, weather conditions, panel orientation, shading, and installation quality.',
  },
  {
    q: 'Do I need an account to use the calculator?',
    a: 'No, the calculator is free to use without an account. You only need an account to list products in the marketplace and manage your seller profile.',
  },
  {
    q: 'How do I list a product for sale?',
    a: 'Register for an account, then go to your profile page and click "Add Product." Fill in the product details, set your price in PKR, and upload images. Your listing will appear in the marketplace.',
  },
  {
    q: 'Can I edit or delete my product listings?',
    a: 'Yes. You can edit or delete only your own listings from your profile/seller dashboard. Other users cannot modify your products — this is enforced by the backend.',
  },
  {
    q: 'Is there a payment system for buying products?',
    a: 'No payment integration is currently implemented. The marketplace is for listing and browsing products. Contact the seller directly for purchase arrangements.',
  },
  {
    q: 'How does the admin panel work?',
    a: 'The admin panel is a separate protected dashboard for the website owner. Admins can view statistics, manage users, moderate product listings, manage categories, and suspend or reactivate accounts. Admin access is configured through the backend, not through public registration.',
  },
];

export default function FAQ() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-yellow-400 text-navy-900 mb-4">
          <HelpCircle className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-bold text-navy-900 mb-2">
          Frequently Asked Questions
        </h1>
        <p className="text-gray-500">Everything you need to know about the calculator and marketplace.</p>
      </div>

      <div className="space-y-3">
        {FAQS.map((faq, i) => (
          <details
            key={i}
            className="group bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
          >
            <summary className="flex items-center justify-between cursor-pointer p-4 select-none">
              <span className="font-semibold text-navy-900 text-sm">{faq.q}</span>
              <span className="ml-4 shrink-0 text-yellow-500 group-open:rotate-180 transition-transform">
                ▼
              </span>
            </summary>
            <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed">
              {faq.a}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
